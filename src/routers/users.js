const express=require('express')
const router = new express.Router()
const User= require('../models/users')
const auth=require('../middleware/auth')
const multer =require('multer')
const sharp =require('sharp')
const { sendWelcomeMail ,sendFarewellEmail } =require('../emails/accounts')



//add new user

//we generate a token everytime we create a new user
router.post('/users', async (req , res) => {
    const user= new User(req.body)


    try {
        
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})

    } catch (e){
        res.status(400).send(e)

    }
    // user.save().then(() =>{
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    //  })
})

//login
// whwnever we login , here we have make a function findByCredentials in which we check whether the given password and email 
//are coorect or not, and in turn we return thr user
//everytime we login a new token is created as whenever we login with other device or somethinf a new token is generated

router.post('/users/login' , async (req ,res) => {
    try{
      
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
       res.send({user,token})

    } catch(e) {
        res.status(400).send("mnhgfd")

    }
})



//logout
//here for logout we filter out all the login token except the one which we have to delelte
//thus we get logged out
router.post('/users/logout' ,auth, async (req ,res) => {
    try{
         
        req.user.tokens= req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        
       res.send()

    } catch(e) {
        res.status(500).send()

    }
})

//logout all
//we remove all the token from the tokens array thus we get logged out from all the seessions
router.post('/users/logoutAll' ,auth, async (req ,res) => {
    try{
         
        // req.user.tokens= req.user.tokens.filter((token) => false)
        req.user.tokens=[]
        await req.user.save()
        
       res.send()

    } catch(e) {
        res.status(500).send()

    }
})


//get info the profile
//simply the user first get authorises and the user is returned from the auth function
router.get('/users/me', auth, async (req,res) => {
    //usind async await
    res.send(req.user)
    
   

    // using promises
    //   User.find({}).then((users) => {
    //         res.send(users)
    //   }).catch((e)=> {
    //        res.status(500).send()
    //   })
})



// get user info by id
// router.get('/users/:id', async (req ,res) => {
//     const _id=req.params.id
//     console.log(req.params)

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)

//     } catch {
//         res.status(500).send()



//     }
//     // User.findById(_id).then((user) => {
//     //     if(!user)
//     //     {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)

//     // }).catch((e)=> {

//     //     res.status(500).send()
//     // })
// })

//updating a user usinf authorization, only the aythorised user can update the information for this we have used jsonwebtokens
//we have made the auth.js file and generated a token for the user and then verify it if it is verified then a user is returned
//by the auth functiion and we update the information other wose if the user is not authenticarion it send back an error
router.patch('/users/me' , auth ,async(req,res) => {
    const Updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email', 'password' , 'age']
    const isValidOperation = Updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send(' Error ! Invalid Operation')
    }

    try{
         
          Updates.forEach((update) => req.user[update]=req.body[update])
          await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id , req.body ,{ new :true , runValidators:true})
        
         res.send(req.user)
    }catch (e) {
        res.status(400).send(e)
    }
})

//deleting a user
router.delete('/users/me', auth ,async (req , res) => {
    try{
        sendFarewellEmail(req.user.email , req.user.name)
        await req.user.remove()
        res.send(req.user)

     } catch(e){
         res.status(500).send(e)

    }


})



const upload =multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req ,file , cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('Upload a image file'))
        }
        cb(undefined , true)
    }
})

//to get a error message we add the (error,req,res,next) as an argument to the function
// to save the image in the user modelwe have created a avatart field in the user model and we have saved the image
// in the vatar field...and we have also authenticted 
router.post('/users/me/avatar' , auth ,upload.single('avatar'), async (req,res) => {
    const buffer= await sharp(req.file.buffer).resize({ width:250 , height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send(req.user)
} ,(error,req,res,next) => {
    res.status(400).send({ error: error.message})
})

router.delete('/users/me/avatar' , auth ,upload.single('avatar'), async (req,res) => {
    req.user.avatar=undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/avatar'  , async (req,res) => {
   try { const user= await User.findById(req.params.id)
    if(!user || !user.avatar)
    {
        throw new Error()
     }
     res.set('Content-Type','image/png')
    res.send(user.avatar)} catch(e) {
        res.status(404).send()
    }
})


module.exports = router