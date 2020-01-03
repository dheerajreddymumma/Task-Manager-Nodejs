const express = require('express')
require('./db/mongoose')
const tasks = require('./models/tasks')
const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')
//express application
const app = express()

//adding a port number
const port = process.env.PORT

//middleware
// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('Get function is disabled')
//     } else {
        
//     }
//     next()
// })

//allowing the data from http request to be convereted to json format.(Including req.body)
app.use(express.json())


const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //format for cb is (error to pass to the callback, true or false)
        if(!file.originalname.endsWith('.pdf')) {
            return cb(new Error('File must be a pdf type'))
        }
        cb(undefined, true)
    }
})

//parameter for middleware is the key of the parameter
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})

//User router
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is running on port '+ port)
})