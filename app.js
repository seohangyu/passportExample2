var express = require('express'); // 서버를 만들때 필요한 http 확장 모듈
var http = require('http'); // express는 기본 http모듈을 필요로 한다
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var config = require('./config/config');

var database_loader = require('./database/database_loader');
var route_loader = require('./routes/route_loader');

// 암호화 모듈
var crypto = require('crypto');

//===== Passport 사용 ======//
var passport = require('passport');
var flash = require('connect-flash');


var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.set('view engine', 'pug');

console.log('config.server_port ' + config.server_port);
app.set('port', config.server_port || 3000);
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended:false})); // 외부 모듈 생성 미들웨어로 얘를 등록해주면 포스트방식으로 요청이 들어왔을대 알아서 처리해줌.(req.body에넣어줌);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

// ===== Passport 초기화 ======//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var configPassport = require('./config/passport');
configPassport(app, passport);

var router = express.Router();
route_loader.init(app, router);

var userPassport = require('./routes/user_passport');
userPassport(router, passport);


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
})

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
    
    database_loader.init(app, config);
});

