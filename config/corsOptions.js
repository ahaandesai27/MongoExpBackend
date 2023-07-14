
const whitelist = ['http://localhost:3500', 'http://localhost:3000', 'http://localhost:4200'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log('origin: ', origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 
}
module.exports = corsOptions;