import { UserRole } from '../User/schema.js';

/**
 * Middleware to verify if a user has the required role to access a route
 * @param {Array} allowedRoles - Array of roles that are allowed to access the route
 * @returns {Function} - Express middleware function
 */
export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists in session
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized: No user found in session' });
        }

        // Check if user has a role
        if (!req.session.user.role) {
            return res.status(403).json({ error: 'Forbidden: User has no role assigned' });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({
                error: 'Forbidden: Insufficient permissions',
                message: `This route requires one of the following roles: ${allowedRoles.join(', ')}`,
                userRole: req.session.user.role
            });
        }

        // User has the required role, proceed to the next middleware or route handler
        next();
    };
};

export const isGuest = () => {
    return verifyRole([UserRole.GUEST]);
};

/**
 * Middleware to verify if a user is an admin
 * @returns {Function} - Express middleware function
 */
export const isAdmin = () => {
    return verifyRole([UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a manager
 * @returns {Function} - Express middleware function
 */
export const isManager = () => {
    return verifyRole([UserRole.MANAGER, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is an employee (any role except GUEST)
 * @returns {Function} - Express middleware function
 */
export const isEmployee = () => {
    return verifyRole([
        UserRole.HR,
        UserRole.MKT,
        UserRole.MACHINING,
        UserRole.QUALITY,
        UserRole.SURFACE_PROCESSING,
        UserRole.FINANCE,
        UserRole.PROJECT_MANAGEMENT,
        UserRole.ADMIN
    ]);
};

/**
 * Middleware to verify if a user is an HR staff
 * @returns {Function} - Express middleware function
 */
export const isHR = () => {
    return verifyRole([UserRole.HR, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Marketing staff
 * @returns {Function} - Express middleware function
 */
export const isMKT = () => {
    return verifyRole([UserRole.MKT, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Machining staff
 * @returns {Function} - Express middleware function
 */
export const isMachining = () => {
    return verifyRole([UserRole.MACHINING, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Quality Control staff
 * @returns {Function} - Express middleware function
 */
export const isQC = () => {
    return verifyRole([UserRole.QUALITY, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Surface Processing staff
 * @returns {Function} - Express middleware function
 */
export const isSP = () => {
    return verifyRole([UserRole.SURFACE_PROCESSING, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Finance staff
 * @returns {Function} - Express middleware function
 */
export const isFinance = () => {
    return verifyRole([UserRole.FINANCE, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is a Project Management staff
 * @returns {Function} - Express middleware function
 */
export const isPM = () => {
    return verifyRole([UserRole.PROJECT_MANAGEMENT, UserRole.ADMIN]);
};

/**
 * Middleware to verify if a user is accessing their own data
 * @param {Function} getIdFromParams - Function to extract the ID from request parameters
 * @returns {Function} - Express middleware function
 */
export const isOwner = (getIdFromParams = (req) => req.params.id) => {
    return (req, res, next) => {
        // Check if user exists in session
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized: No user found in session' });
        }

        // Get the ID from the request parameters
        const resourceId = getIdFromParams(req);

        // Check if the user is accessing their own data
        if (req.session.user.id !== resourceId && req.session.user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                error: 'Forbidden: You can only access your own data',
                message: 'This resource belongs to another user'
            });
        }

        // User is accessing their own data or is an admin, proceed
        next();
    };
};
