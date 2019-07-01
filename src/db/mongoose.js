const mongoose =require('mongoose')


mongoose.connect(process.env.MONGODB_URL ,{
    useNewUrlParser:true,
    useCreateIndex:true
})



// const me = new User({
//     name:'        Ankit      ',
//     email:'                 ANKIT.msd@gmail.com',
//     password: '        paSSword      '

// })
// me.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })


// const task1= new Task({
//     description:'to sleep           ',
   
// })
// task1.save().then((task1) =>{
//     console.log(task1)
// }).catch((error) => {
//     console.log(error)
// })