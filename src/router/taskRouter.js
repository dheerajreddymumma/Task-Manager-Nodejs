const express = require('express')
const tasks = require('./../models/tasks')
const auth = require('./../middleware/auth')
const router = express.Router()

router.get('/tasks', async (req, res) => {
    try {
        const allTasks = await tasks.find({})
        if(!allTasks || allTasks.length == 0) {
            res.status(404).send('No record found')
        }
        res.send(allTasks)
    }
    catch(e) {
        res.status(500).send(e)
    }

    // tasks.find({})
    // .then((tasks) => {
    //     if(!tasks) {
    //         res.status(404).send('No record found')
    //     }
    //     res.send(tasks)
    // })
    // .catch((e) => res.status(500).send(e))
})

router.get('/tasks/all', auth, async (req, res) => {
    try {
        // const allTasks = await tasks.find({owner: req.user._id})
        // if(!allTasks || allTasks.length == 0) {
        //     res.status(404).send('No record found')
        // }
        // res.send(allTasks)


        //await req.user.populate('myTasks').execPopulate()
        const match = {}
        if(req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        await req.user.populate({
            path: 'myTasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    createdAt: -1
                }
            }
        })
        res.send(req.user.myTasks)
    }
    catch(e) {
        res.status(500).send(e)
    }

    // tasks.find({})
    // .then((tasks) => {
    //     if(!tasks) {
    //         res.status(404).send('No record found')
    //     }
    //     res.send(tasks)
    // })
    // .catch((e) => res.status(500).send(e))
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await tasks.findById(req.params.id)
        const task = await tasks.findOne({_id, owner: req.user._id })
        if(!task)
            res.status(404).send('No record found')
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }

    // tasks.findById(req.params.id)
    // .then((result) => {
    //     if(!result) {
    //         res.status(404).send('No record found')
    //     }
    //     res.send(result)
    // })
    // .catch((e) => res.status(500).send(e))
})

router.post('/tasks', auth, async (req, res) => {
    try {
        const body = { ...req.body, owner: req.user._id}
        const result = await tasks.create(body)
        res.send(result)
    }
    catch(e) {
        res.status(500).send(e)
    }
    // tasks.create(req.body).then((result) => {console.log(result); res.send(result)}).catch(e => res.send(e))
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation)
        res.status(404).send('Invalid operation. Fields are not to be updated')

    try{
        // const task = await tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        const task = await tasks.findOne({_id:req.params.id, owner: req.user._id})
        if(!task) 
            res.status(404).send("Task does not exist")
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        // const task = await tasks.findByIdAndDelete(req.params.id)
        if(!task) {
            res.status(404).send('User not found')
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router