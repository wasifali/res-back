/**
 * Created by macbookpro on 11/9/15.
 */
module.exports = function(app, passport)
{
    var bcrypt = require('bcrypt-nodejs');
    //var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-auth').Strategy;

    var User = app.models.User;
    var Photographer = app.models.Photographer;


    var validPassword = function (password, storedPassword) {
        return bcrypt.compareSync(password, storedPassword);
    };
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {

        done(null, user);

    });


    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        console.log("********** req body *****")
        console.log(req.body)
        User.findOne({email: req.body.email.toLowerCase()}, function(err, user,res) {
            if(err) {
                return done(null, false, {
                    msg: "Failed to verify user!"
                });
            }

            else if(user && !user.profile_active)
            {
                return done(null, false, {
                    msg: "User is not verified yet"
                });
            }
            else if(user && user.adminBlock )

            {
                return done(null, false, {
                    msg: "User is blocked by admin"
                });
            }


            else if(user){
                if(user.forgotPassword != '') {
                    if(validPassword(req.body.password, user.password) || validPassword(req.body.password, user.forgotPassword)){
                        return done(null, user, null);
                    }
                    else
                    {
                        return done(null, false, {
                            msg: "password is invalid"
                        });
                    }
                }
                else{
                  if(req.body.password != ''){
                    if(!validPassword(req.body.password, user.password)){
                        return done(null, false, {
                            msg: "password is invalid"
                        });
                    }
                    else {
                        return done(null, user, null)
                    }
                  }else{
                    return done(null, null, null)
                  }

                }
            }
            else{
                Photographer.findOne({email: req.body.email.toLowerCase()}, function(err, photographer)
                {
                    if(err) {
                        return done(null, false, {
                            msg: "failed to verify user"
                        });
                    }
                    else if(photographer && !photographer.profile_active)
                    {
                        return done(null, false, {
                            msg: "Photographer is not verified yet"
                        });
                    }
                    else if(photographer && photographer.adminBlock )
                    {
                        return done(null, false, {
                            msg: "Photographer is blocked by admin"
                        });
                    }
                    else if(photographer) {
                        if(photographer.forgotPassword !='') {
                            if(validPassword(req.body.password, photographer.password) || validPassword(req.body.password, photographer.forgotPassword)){
                                return done(null, photographer, null);
                            }
                            else {
                                return done(null, false, {
                                    msg: "password is invalid"
                                });
                            }
                        }
                        else{
                          if(req.body.password != ''){
                            if(!validPassword(req.body.password, photographer.password)){
                                return done(null, false, {
                                    msg: "password is invalid"
                                });
                            }
                            else
                            {
                                return done(null, photographer, null)
                            }
                          }else{
                            return done('Password is not Valid', null, 'Password is not Valid')
                          }

                        }
                    }
                    else{
                        return done(null, false, {
                            msg: "User doesn't exist!"
                        });
                    }
                });
            }
        });
    }));


    passport.use( new FacebookStrategy({
            clientID: app.facebookAuth.clientID,
            clientSecret: app.facebookAuth.clientSecret,
            callbackURL: app.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'email'],
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function(){
                User.findOne({email: profile._json.email.toLowerCase()}, function(err, user,res) {
                    if(err)
                    {
                        return done(null, false, {
                            msg: "Failed to verify user!"
                        });
                    }
                    else if(user)
                    {
                        user.infoMsg = 'signIn';
                        return done(null, user, {msg:'Logged in successfully.'})
                    }

                    else{
                        Photographer.findOne({email: profile._json.email.toLowerCase()}, function(err, photographer)
                        {
                            if(err)
                            {
                                return done(null, false, {
                                    msg: "failed to verify user"
                                });
                            }
                            else if(photographer)
                            {
                                photographer.infoMsg = 'signIn';
                                return done(null, photographer, {msg:'logIn successfully'})

                            }
                            else{
                                profile.infoMsg = 'signUp';
                                done(null, profile, {msg:'Add New User'});
                            }
                        });
                    }
                });
            })
        }
    ));


    passport.use( new GoogleStrategy({
            clientId: app.googleAuth.clientID,
            clientSecret: app.googleAuth.clientSecret,
            callbackURL: app.googleAuth.callbackURL,
            profileFields: ['id', 'name', 'email'],
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(request, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                User.findOne({email: profile.emails[0].value.toLowerCase()}, function(err, user,res)
                {
                    if(err)
                    {
                        return done(null, false, {
                            msg: "User could not be verified."
                        });
                    }
                    else if(user)
                    {
                        user.infoMsg = 'signIn';
                        return done(null, user, {msg:'User logged in successfully.'})
                    }

                    else{
                        Photographer.findOne({email: profile.emails[0].value.toLowerCase()}, function(err, photographer)
                        {
                            if(err)
                            {
                                return done(null, false, {
                                    msg: "Photographer could not be verified."
                                });
                            }
                            else if(photographer)
                            {
                                photographer.infoMsg = 'signIn';
                                return done(null, photographer, {msg:'Photographer logged in successfully.'})

                            }
                            else{
                                profile.infoMsg = 'signUp';
                                console.log(profile)
                                done(null, profile, {msg:'Add New User'});
                            }
                        });
                    }
                });
            })
        }
    ));

};
