const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express');

/**
 * Clerk middleware — initializes Clerk on every request.
 * Must be used as app-level middleware before any route that needs auth.
 */
const initClerk = clerkMiddleware();

/**
 * Protect middleware — rejects requests that don't carry a valid Clerk session.
 * Attaches `req.auth` with `userId`, `sessionId`, etc.
 */
const protect = requireAuth();

/**
 * Helper: extract the userId from a request that has already passed
 * through the Clerk middleware stack.
 */
function getUserId(req) {
    const auth = getAuth(req);
    return auth?.userId ?? null;
}

module.exports = { initClerk, protect, getUserId };
