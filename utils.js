const loggerMiddleware = (req,res,next) => {
    console.log(
      {
      method: req.method,
      date: new Date(),
      body: req.body,
      params: req.params,
      query: req.query,
      url: req.url
      });
      console.log('---------------------------------------------------------')
    next();
  }


  module.exports = {
    loggerMiddleware
  }