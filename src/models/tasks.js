const mongoose = require('mongoose')

const schema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true 
    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
}, {
    timestamp: true
})

const tasks = mongoose.model('tasks', schema)

module.exports = tasks