var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../config');

module.exports = function(app, passport) {
    console.log(config.facebook.clientID)
    return new FacebookStrategy({
        clientID : config.facebook.clientID,
        clientSecret : config.facebook.clientSecret,
        callbackURL : config.facebook.callbackUrl,
        profileFields: ['id', 'email', 'displayName']
    }, function(accessToken, refreshToken, profile, done) {
        console.log('passport의 facebook 호출됨');
        console.dir(profile);
        
        var criteria = {
            'facebook.id' : profile.id 
        };
        
        var database  = app.get('database');
        database.UserModel.findByEmail('asdf@naver.com', function(err, user) {
            console.log('user');
            console.log(user);
            
            
        })
        database.UserModel.load(criteria, function(err, user) {
            console.log('머라도 찍혀봐 ㅠㅠ')
            
            if(err) return done(err);
            
            if(!user) {
                var user = new database.UserModel({
                    name : profile.displayName,
                    email : profile.emails ? profile.emails[0].value : profile.displayName,
                    provider : 'facebook',
                    facebook : profile._json 
                });
                user.save(function(err) {
                    if(err) console.log(err);
                    return done(err, user);
                })
            } else {
                return done(err, user);
            }
        })
    })
}