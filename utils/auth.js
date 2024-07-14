const JWT = require('jsonwebtoken')

const secret = '!superman#4'

const createToken = (user) => {
    const payload = {
        _id: user._id, 
        email: user._email,
        name: user.name,
        profileImageUrl: user._profileImageUrl,
        role: user.role
    }

    const token = JWT.sign(payload, secret);
    return token;
}

const verifyToken = (token) => {
    const payload = JWT.verify(token, secret);

    return payload;
}

module.exports = {
    createToken,
    verifyToken
}