const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./tasks')
const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Email is not valid')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0)
            throw new Error('Age must be positive')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if( value.toLowerCase().indexOf('password') != -1 || value.length <= 6)
                throw new Error('Password is invalid')
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamp: true
})

//toJSON method is called when stringify is called on an object. res.send will call stringify internally
schema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()
    
    //console.log(user)
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    //console.log(userObj)
    return userObj
}

//This column is not part of the schema but can generate it using instanceOfSchema.populate('myTasks').execPopulate
schema.virtual('myTasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
})

//Generate auth token. Called when user logs in or when user is created
schema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//Get the user from the given credentials
schema.statics.findByCreditials = async (email, password) => {
    const user = await users.findOne({email})
    if(!user)
        throw new Error('User does not exist')
    
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched)
        throw new Error('Password does not match')

    //to get all tasks for a user
    //await user.populate('myTasks').execPopulate()
    return user
}

//Call before the save function to ensure that the password is encrypted
schema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        user.save()
    }
    next()
})

//Call before the remove frunction to ensure that tasks are deleted
schema.pre('remove', async function(next) {
    const user = this
    console.log('This is being called for task')
    await task.deleteMany({owner: user._id})
    next()
})

const users = mongoose.model('users', schema)

// const prm = users.create({name: "Dheeraj", email: "dheerajreddy@gmail.com", age: 25})
// console.log('test 1')
// prm
// .then(value => console.log('correct ' + value))
// .catch(err => console.log('error ' + err))

// console.log('test 2')


module.exports = users