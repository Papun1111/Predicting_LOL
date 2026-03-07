export const errorHandler = (err, req, res, next) => {
    // If status code is 200 (OK) but there's an error, default to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Only show stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
//# sourceMappingURL=errorMiddleware.js.map