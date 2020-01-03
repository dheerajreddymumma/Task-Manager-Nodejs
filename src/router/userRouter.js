const express = require('express')
const users = require('./../models/users')
const auth = require('./../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()

router.post('/users/login', async (req, res) => {
    try{
        const user = await users.findByCreditials(req.body.email, req.body.password)
        if(!user)
            throw new Error('Username is not valid')
        const token = await user.generateAuthToken()
        res.send({user: user, token})
    } catch(e) {
        console.log(e.message)
        res.status(404).send('Username or password incorrect')
    }
})

router.get('/users', async (req, res) => {
    // users.find({})
    // .then((users) => {
    //     if(!users) {
    //         res.status(404).send('No record found')
    //     }
    //     res.send(users)
    // })
    // .catch((e) => res.status(500).send(e))

    try {
        const filteredUsers = await users.find({})
        if(!filteredUsers || filteredUsers.length == 0)
            res.status(404).send('No record found')
        res.send(filteredUsers)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    //console.log(req.user)
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('User logged out')
    }
    catch(e) {
        res.status(500).send('Error while logging out user')
    }
})

router.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('User logged out of all sessions')
    }
    catch(e) {
        res.status(500).send('Error while logging out user')
    }
})

router.get('/users/:id', async (req, res) => {
    // users.findById(req.params.id)
    // .then((result) => {
    //     if(!result) {
    //         res.status(404).send('No record found')
    //     }
    //     res.send(result)
    // })
    // .catch((e) => res.status(500).send(e))

    try {
        const result = await users.findById(req.params.id)
        if(!result)
            res.status(404).send('No record found')
        res.send(result)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    // console.log(req.params)
    // console.log(req.body) 
    // console.log(req.query)
    try {
        const result = await users.create(req.body)

        const user = await users.findByCreditials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    }
    catch(e) {
        res.status(500).send(e)
    }
   // users.create(req.body).then((result) => {console.log(result); res.send(result)}).catch((e) => console.log(e))
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)
        res.status(404).send('Invalid operation. Fields are not to be updated')
    try{
        const user = await users.findById(req.params.id)
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        // const user = await users.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) 
            res.status(404).send("User does not exist")
        res.send(user)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)
        res.status(404).send('Invalid operation. Fields are not to be updated')
    try{
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        // const user = await users.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) 
            res.status(404).send("User does not exist")
        res.send(user)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await users.findByIdAndDelete(req.params.id)
        if(!user) {
            res.status(404).send('User not found')
        }
        res.send(user)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await users.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     res.status(404).send('User not found')
        // }
        req.user.remove()
        res.send(req.user)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

const upload = multer({
   // dest: 'avatar', To save the file at a destination. Don't want this as we want to save it in mongoDB
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if(!req.user.avatar) {
            return res.status(400).send('User avatar does not exist')
        }
        // res.set('Content-Type', 'image/jpg')
        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    }
    catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router