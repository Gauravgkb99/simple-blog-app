const {Router } = require('express')
const User = require('../models/user.models')
const router = Router()

router.get('/signIn', (req, res) => {
    return res.render('signIn')
})

router.get('/signUp', (req, res) => {
    return res.render('signUp')
})

router.post('/signIn', async (req, res) => {
    const {email, password} = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
    
        return res.cookie('token', token).redirect('/')
    } 
    catch (error) {
        return res.render('signIn', {
            error: 'Incorrect Email or Password'
        })
    }
})

router.post('/signUp', async (req, res) => {
    try {
        const {name, email, password} = req.body;
    
        const user = await User.create({
            name: name,
            email: email,
            password: password,
        })
    } catch (error) {
        console.log('Error creating user: ', error);
    }


    return res.redirect('/')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

module.exports = router