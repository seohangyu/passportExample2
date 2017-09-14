module.exports = {
    server_port:3000,
    db_url:'mongodb://localhost:27017/local',
    db_schemas: [
        {file:'./user_schema', collection:'users7', schemaName:'UserSchema',
        modelName:'UserModel'}
    ],
    route_info: [
       
    ],
    facebook: {
        clientID : '117703445598864',
        clientSecret: '23bbc7665d71b76881910c741412c0fb',
        callbackUrl: '/auth/facebook/callback'
    },
    google: {
        clientID : '1079838525279-fuukdojtoag1sbjjeuuuodp1puq6vs4f.apps.googleusercontent.com',
        clientSecret: 'D-W4rd3UL5ETkIdxodIze1R2',
        callbackUrl: '/auth/google/callback'
    }
};