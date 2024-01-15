/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
module.exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Api url doesn't exist",
  });
  next();
};
