const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        if(!token)
            throw new Error('Unauthorized')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        await user.populate('myTasks').execPopulate()
        req.user = user
        req.token = token
        next()
        // console.log(token)
    }
    catch(e) {
        res.send('Unauthorized')
    }
}

module.exports = auth