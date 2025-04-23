export const errorHandler = (err, req, res, next) => {
    console.error(err); // Optional: log full error for debugging

    // Zod validation errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error!',
            errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message: ` This "${field}" already exists!`,
        });
    }

    // Custom errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Default to 500 server error
    return res.status(500).json({ message: 'Internal Server Error' });
};
