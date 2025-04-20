import { UserRole } from '../Users/schema.js';

// Middleware to verify session
export const verifySession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: No active session' });
    }

    // Add user info to request
    req.user = req.session.user;
    next();
};

// Middleware to check if user has required role
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
}; 