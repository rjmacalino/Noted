const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionSuccessStatus: 200 
}

// how to push to new branch in github
// git checkout -b new-branch-name
// git add .
// git commit -m "message"
// git push origin new-branch-name
