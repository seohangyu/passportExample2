
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
    
    console.log('createSchema 호출됨.');
    
    var UserSchema = mongoose.Schema({
        email: {type:String, 'default': ''},
        hashed_password: {type:String, 'default': ''},
        name: {type:String, index:'hashed', 'default':''},
        salt: {type:String}, 
        created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at: {type:Date, index:{unique:false}, 'dfeault':Date.now()},
        provider: {type:String, 'default': ''},
        authToken: {type: String, 'default': ''},
        facebook: {},
        google: {}
    });
    console.log('UserSchema 정의함');
    
    UserSchema.path('email').validate(function(email) {
        return email.length;
    }, 'email 칼럼의 값이 없습니다.');

    UserSchema
        .virtual('password')
        .set(function(password) {
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 저장됨 : ' + this.hashed_password);
        });

    UserSchema.method('encryptPassword', function(plainText, inSalt) {
        if(inSalt) {
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex'); // 암호화

        } else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    })

    UserSchema.method('makeSalt', function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
        if(inSalt) {
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText, inSalt) === hashed_password;     
        } else {
            console.log('authenticate 호출됨.');
            return this.encryptPassword(plainText) === hashed_password;     
        }
    });

    UserSchema.static('findByEmail', function(email, callback) {  // 자바스크립트에서 this는 함수를 호출한 객체를 참조
        return this.findOne({email:email}, callback);
    });


    UserSchema.static('findAll', function(callback) {            
        return this.find({}, callback); 
    });  
    
    UserSchema.static('load', function(criteria, callback) {
        
        return this.findOne(criteria, callback);
    })
    
    return UserSchema;
}

module.exports = Schema;