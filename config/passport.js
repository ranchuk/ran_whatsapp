const jwt = require('jsonwebtoken');
const secretOrKey = require('../config/keys/keys').secretOrKey;
function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    if(typeof bearerHeader != 'undefined'){
        // const bearer = bearerHeader.split(' ');
        // const bearerToken = bearer[1];
          // req.token = bearerToken;

        jwt.verify(bearerHeader, secretOrKey, function(err, decoded) {
            if(!err){
                req.decoded_token = decoded;
                next();
            }
            else{                
                res.sendStatus(403);
                throw new Error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TOKEN NOT VERIFIED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            }
          });
      }
    else{
        res.sendStatus(403);
    }
}

module.exports = {
    verifyToken,
}

// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const mongoose = require("mongoose");
// const User = mongoose.model("users");
// const keys = require("../config/keys");

// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = keys.secretOrKey;

// module.exports = passport => {
//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) => {
//       User.findById(jwt_payload.id)
//         .then(user => {
//           if (user) {
//             return done(null, user);
//           }
//           return done(null, false);
//         })
//         .catch(err => console.log(err));
//     })
//   );
// };