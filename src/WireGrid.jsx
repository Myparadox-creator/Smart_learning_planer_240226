import { useEffect, useRef } from 'react';

/**
 * WireGrid — A canvas-based circuit/wire animation.
 * Draws a grid of nodes connected by wires that "charge up"
 * (glow with energy) as the cursor moves near them,
 * with electricity pulses flowing along the wires.
 */
export default function WireGrid() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        /* ── Configuration ── */
        const CELL = 55;            // grid spacing
        const CHARGE_RADIUS = 200;  // how far the cursor charges
        const FADE_SPEED = 0.04;    // how fast charge fades
        const CHARGE_SPEED = 0.12;  // how fast charge builds up
        const NODE_RADIUS = 2.2;
        const WIRE_WIDTH = 1.2;
        const PULSE_SPEED = 3;      // pixels per frame
        const PULSE_SPAWN_RATE = 0.025; // chance per charged wire per frame

        /* ── Colors ── */
        const WIRE_IDLE = 'rgba(0, 0, 0, 0.04)';
        const NODE_IDLE = 'rgba(0, 0, 0, 0.06)';
        const COLOR_CHARGED = { r: 79, g: 70, b: 229 };   // indigo
        const COLOR_ENERGY = { r: 14, g: 165, b: 233 };   // sky-blue

        /* ── State ── */
        let nodes = [];
        let wires = [];
        let pulses = [];
        let W, H, cols, rows;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildGrid();
        }

        function buildGrid() {
            nodes = [];
            wires = [];
            pulses = [];
            cols = Math.ceil(W / CELL) + 1;
            rows = Math.ceil(H / CELL) + 1;

            // Create nodes
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    nodes.push({
                        x: c * CELL,
                        y: r * CELL,
                        charge: 0,
                        col: c,
                        row: r,
                    });
                }
            }

            // Create horizontal & vertical wires
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = r * cols + c;
                    // horizontal wire to the right
                    if (c < cols - 1) {
                        wires.push({ a: idx, b: idx + 1, charge: 0 });
                    }
                    // vertical wire downward
                    if (r < rows - 1) {
                        wires.push({ a: idx, b: idx + cols, charge: 0 });
                    }
                }
            }
        }

        /* ── Mouse tracking ── */
        function onMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        }

        function onMouseLeave() {
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        }

        /* ── Animation loop ── */
        function animate() {
            ctx.clearRect(0, 0, W, H);
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // ── Update node charge ──
            for (const node of nodes) {
                const dx = node.x - mx;
                const dy = node.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const target = dist < CHARGE_RADIUS ? 1 - dist / CHARGE_RADIUS : 0;

                if (target > node.charge) {
                    node.charge += (target - node.charge) * CHARGE_SPEED;
                } else {
                    node.charge -= FADE_SPEED;
                }
                node.charge = Math.max(0, Math.min(1, node.charge));
            }

            // ── Update wire charge ──
            for (const wire of wires) {
                const maxCharge = Math.max(nodes[wire.a].charge, nodes[wire.b].charge);
                if (maxCharge > wire.charge) {
                    wire.charge += (maxCharge - wire.charge) * CHARGE_SPEED;
                } else {
                    wire.charge -= FADE_SPEED;
                }
                wire.charge = Math.max(0, Math.min(1, wire.charge));
            }

            // ── Draw wires ──
            for (const wire of wires) {
                const na = nodes[wire.a];
                const nb = nodes[wire.b];

                ctx.beginPath();
                ctx.moveTo(na.x, na.y);
                ctx.lineTo(nb.x, nb.y);
                ctx.lineWidth = WIRE_WIDTH;

                if (wire.charge > 0.01) {
                    const c = COLOR_CHARGED;
                    const alpha = wire.charge * 0.55;
                    ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                    // glow
                    ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.6})`;
                    ctx.shadowBlur = wire.charge * 12;
                } else {
                    ctx.strokeStyle = WIRE_IDLE;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Spawn pulses on charged wires
                if (wire.charge > 0.3 && Math.random() < PULSE_SPAWN_RATE) {
                    const forward = Math.random() > 0.5;
                    pulses.push({
                        wire,
                        t: 0,
                        forward,
                        life: 1,
                        speed: PULSE_SPEED * (0.7 + Math.random() * 0.6),
                    });
                }
            }

            // ── Draw nodes ──
            for (const node of nodes) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, NODE_RADIUS + node.charge * 2, 0, Math.PI * 2);

                if (node.charge > 0.01) {
                    const c = COLOR_CHARGED;
                    const alpha = 0.12 + node.charge * 0.7;
                    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                    ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.5})`;
                    ctx.shadowBlur = node.charge * 15;
                } else {
                    ctx.fillStyle = NODE_IDLE;
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // ── Update & draw pulses (energy flowing along wires) ──
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                const na = nodes[p.wire.a];
                const nb = nodes[p.wire.b];
                const dx = nb.x - na.x;
                const dy = nb.y - na.y;
                const len = Math.sqrt(dx * dx + dy * dy);

                p.t += p.speed / len;
                p.life -= 0.02;

                if (p.t > 1 || p.life <= 0) {
                    pulses.splice(i, 1);
                    continue;
                }

                const t = p.forward ? p.t : 1 - p.t;
                const px = na.x + dx * t;
                const py = na.y + dy * t;

                const c = COLOR_ENERGY;
                const alpha = p.life * p.wire.charge * 0.9;
                const radius = 2.5 + p.life * 2;

                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                ctx.shadowBlur = 16;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animFrameRef.current = requestAnimationFrame(animate);
        }

        /* ── Setup ── */
        resize();
        const parent = canvas.parentElement;
        parent.addEventListener('mousemove', onMouseMove);
        parent.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('resize', resize);
        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            parent.removeEventListener('mousemove', onMouseMove);
            parent.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}
