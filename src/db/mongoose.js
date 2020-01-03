const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
.then((res) => console.log('Connected to database'))
.catch(e => console.log(e))