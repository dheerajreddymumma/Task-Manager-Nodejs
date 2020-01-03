//Not required
const mongodb = require('mongodb')
const {MongoClient: mongoClient, ObjectId} = mongodb
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

mongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Error in connecting to the database')
    }

    const db = client.db(databaseName)
    console.log('connected successfully')
    // console.log(db.databaseName)
    // db.createCollection('users',(error, collection) => {
    //     if(error)
    //         return console.log('creating collection failed')
    //     console.log('created collection ' + collection.collectionName)
        
    // })
    // db.collection('users').insertOne({'name': 'Dheeraj', 'Age': 23}, (error, res) => {
    //     if(error) {
    //         return console.log('Error in inserting the data')
    //     }
    //     console.log('Inserted ' + res.insertedCount + ' rows')
    //     console.log('Values returned is ' + res.result.n + ' ' + res.result.ok)
    //     console.log(res.insertedId + ' ')
    // })

    // db.collection('users').insertMany([{'name': 'Niraj', 'Age': 24}, {'name': 'Hitesh', 'Age': 26}],(error, result) => {
    //     if(error)
    //         return console.log("error inserting records")
    //     console.log(result.ops)
    // })
    
    // db.collection('tasks').insertMany([{'description': 'task 4', 'completed': false}, 
    // {'description': 'task 5', 'completed': true}, 
    // {'description': 'task 6', 'completed': false}], (error, result) => {
    //     if(error) {
    //         return console.log('Error while inserting documents')
    //     }
    //     console.log(result.insertedCount + ' ' + result.ops)
    // })

    // db.collection('users').findOne({'name': 'Dheeraj'}, (error, result) => {
    //     if(error)
    //         return console.log('Error in finding a document')
    //     if(!result)
    //         return console.log('No results found')
    //     console.log(result)
    // })

    // db.collection('users').findOne({'name':'Dheerfaj'}).then((result) => console.log(result), 
    // (error) => console.log(error)).catch((error) => console.log(error))

    // db.collection('tasks').find({completed: false}).toArray((error, result) => {
    //     console.log(result)
    // })


    // console.log('find all occurences' + db.collection('users').find({'name': 'Dheeraj'}).)
    //console.log("Program hasn't ended boy")


    // db.collection('tasks').updateOne({'description': 'task 2'}, {$inc:{completed: 2}})
    // .then((res)=>{
    //     console.log(res.upsertedId)
    //     console.log(res.matchedCount)
    //     console.log(res.modifiedCount)
    //     console.log(res.result)
    //     console.log(res.connection)
    // }, (err) => {
    //     console.log(err)
    // })
    // .catch((err) => {
    //     console.log(err)
    // })

    // db.collection('tasks').updateMany({}, {$set: {completed: true}})
    // .then(
    //     result => console.log(result)
    // )
    // .catch(
    //     err => console.log(err)
    // )

    // db.collection('users').deleteOne({name: 'Dheeraj'})
    // .then(res => console.log(res))
    // .catch(err => console.log(err))

    
})