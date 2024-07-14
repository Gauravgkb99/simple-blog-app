const {Schema, model} = require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const {createToken} = require('../utils/auth')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String, 
        default: '/images/default-profileImage.png'
    },
    role: {
        type: String,
        enum: ['User', "Admin"],
        default: 'User'
    }

}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
                    .update(this.password)
                    .digest('hex')

    this.salt = salt;
    this.password = hashedPassword;
})  

userSchema.static('matchPasswordAndGenerateToken', async function(email, givenPassword) {
    const user = await this.findOne({email});

    if(!user) throw new Error('User not found');
    const hashedPassword = user.password;

    const userProvidedPasswordHashed = createHmac('sha256', user.salt)
                                        .update(givenPassword)
                                        .digest('hex')

    if(hashedPassword !== userProvidedPasswordHashed){
        throw new Error('Incorrect Password');
    }

    const token = createToken(user);

    return token;
})

const user = model('User', userSchema)

module.exports = user;