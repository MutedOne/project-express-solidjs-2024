const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const authenticationMiddleware = async (req, res, next) => {
  
    try {
      const result = req.headers['authorization'] ? req.headers['authorization'].slice(7) : null;
   

      const jwtSign = await jwt.verify(result, secretKey);
      res.locals.jwtSign = jwtSign; // Store the verified token in res.locals
      next(); // Move next() here, only when the token is valid
    } catch (error) {
        console.error(error);
        res.status(200).send({ status: "JsonWebTokenError" });
        // No next() here, as the token is not valid
    }
  };

  export{
    authenticationMiddleware
  } 