const sgmail =require('@sendgrid/mail')


sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email,name) => {
    sgmail.send({
        to:email,
        from:'agra49@gmail.com',
        subject:'Thanks for joining in!',
        text:`Hope you are enjoying, ${name}. Let me know how you are going along`
    })

}


const sendFarewellEmail = (email,name) => {
    sgmail.send({
        to:email,
        from:'agra49@gmail.com',
        subject:'We are sad that you are leaving!',
        text:`Hope you enjoyed, ${name}. Let me when  you are coming back`
    })

}




module.exports ={
    sendWelcomeMail,
    sendFarewellEmail
}
