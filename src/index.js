const express=require('express')
require('./db/mongoose')
const User=require('./models/users')
const Task=require('./models/tasks')
const userRouter=require('./routers/users')
const taskRouter=require('./routers/tasks')



const app=express()
const port=process.env.PORT

// app.use((req,res,next) =>{
//     res.status(503).send('Site is under Maintainence mode')

// })
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port ,() => {
    console.log('Server is open on port' + port)
})



// const jwt = require('jsonwebtoken')

// const myFunction = async ()=>{
//     const token = await jwt.sign({_id:'456789'},'hello',{ expiresIn: '3 hours' })
//     console.log(token)

//     const data= await jwt.verify(token , 'hello')
//     console.log(data)
    
// }
// myFunction()

// const main = async () => {
//     const user = await User.findById('5d17607db02bf81244f367d7')
//     console.log(user.tasks)
// }
// main()