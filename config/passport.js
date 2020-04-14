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


function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split('');
        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    }
    else{
        res.sendStatus(403);
    }
}
