const {verifyToken} = require('../utils/auth')

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieName = req.cookies[cookieName];

        if(!tokenCookieName){
            return next();
        }

        try{
            const userPayLoad = verifyToken(tokenCookieName);
            req.user = userPayLoad
        }
        catch(error){
            console.log(error)
        }

        next();
    }
}

module.exports = checkForAuthenticationCookie;