var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var facebook = require('./passport/facebook');
var google = require('./passport/google');

module.exports = function(app, passport) {
    console.log('config/passport 호출됨.');
    
    passport.serializeUser(function(user, done) { // 인증이 성공시 불림
        console.log('serializeUser 호출됨.');
        console.dir(user);

        done(null, user);
    });

    passport.deserializeUser(function(user, done) { // 로그인 상태인 경우 
        console.log('deserializeUser 호출됨');
        console.log(user);

        done(null, user);
    });

    //===== Passport Strategy 설정 ======//
    passport.use('local-login', local_login(app) );
    passport.use('local-signup', local_signup(app) );
    passport.use('facebook', facebook(app, passport));
    passport.use('google', google(app, passport));
    
    console.log('passport strategy 등록됨.');
}

