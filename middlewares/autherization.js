
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({ message: '(TOKEN)لا توجد شفره.' });
    }

    try {
        const verified = verifyToken(token, process.env.JWT_ACCESS_SECRET);
        //console.log(verified);
        req.user = verified; // Attach user info to request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'غير مسموح بالدخول شفره غير صالحه .' });
    }
};



export const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        // console.log(requiredRoles);
        // console.log(req.user.role);
        // console.log(requiredRoles.includes(req.user.role));
        if (!requiredRoles.includes(req.user?.role)) {

            return res.status(403).json({
                message: 'عمليه محظوره : ليس لديك الاذن اللازم لاداء هذه العمليه.',
                path: `${req.path}`
            });
        }
        next();
    };

};


