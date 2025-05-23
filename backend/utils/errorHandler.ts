export const errorHandler = (err, req, res, next) => {
    console.log({ err });
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res
        .status(statusCode)
        .json({
            statusCode,
            message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        })
}