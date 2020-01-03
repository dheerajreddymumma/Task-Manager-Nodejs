const sgmail = require('@sendgrid/mail')
const sendGridAPIkey = process.env.sendGridAPI
sgmail.setApiKey(sendGridAPIkey)

// sgmail.send({
//     to:'dheerajreddymumma@gmail.com',
//     from: 'dheerajreddymumma@gmail.com',
//     subject: 'This is a new email',
//     text: 'The deatils of that mail'
// }).then(value => {
//     console.log(value)
// }).catch(e => {
//     console.log(e)
// }) 

const sendWelcomeMail = async (email, name) => {
    const val = await sgmail.send({
        to: email,
        from: 'dheerajreddymumma@gmail.com',
        subject: `Hello ${name}`,
        text: 'The details of that mail'
    })

}

sendWelcomeMail('dheerajreddymumma@gmail.com', 'Niraj')
module.exports = {sendGridAPIkey}