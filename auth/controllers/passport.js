const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Googleuser = require('../models/googleuser');
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        async function (accessToken, refreshToken, profile, done) {

            console.log("Trying to access google account ", profile);

            try {
                let user = await Googleuser.findOne({ googleId: profile.id });
                if (user) {
                    console.log("user is there");
                    done(null, user);
                } else {
                    const newUser = {   // mistake
                        googleId: profile.id,
                        name: profile.displayName,
                        photo: profile.photos[0].value
                    };
                    user = await User.create(newUser);
                    console.log("creating new user");
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }

        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
} 

