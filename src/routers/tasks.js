const express=require('express')
const router = new express.Router()
const Task= require('../models/tasks')
const auth =require('../middleware/auth')

//get all users
//GET /tasks?completed=true
//GET /tasks?limit=2&skip=10
//sorting
router.get('/tasks' ,auth,async (req,res) =>{
    try{
        const match ={}
        const sort ={}
        
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
        }
        // const tasks =await Task.find({owner:req.user._id})
        //res.send(tasks)
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort

            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch {
        res.status(500).send()
    }
} )


// get by id
router.get('/tasks/:id',auth,async (req ,res) => {
    const _id=req.params.id
    console.log(req.params)
    try{
        const task = await Task.findOne({_id , owner:req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    } catch {
        res.status(500).send()
    }
})

//create
router.post('/tasks', auth, async (req,res) =>{
    // const task =new Task(req.body)
    const task =Task({
        ...req.body,
        owner:req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch {
        res.status(400).send(e)

    }

})

//update
router.patch('/tasks/:id' , auth ,async(req,res) => {
    const Updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = Updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send(' Error ! Invalid Operation')
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})
        if(!task)
        {
               return res.status(404).send()
        }
        Updates.forEach((update) => task[update] = req.body[update] )
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id , req.body ,{ new :true , runValidators:true})
       
         res.send(task)
    }catch (e) {
        res.status(400).send(e)
    }
})

//delete
router.delete('/tasks/:id', auth ,async (req , res) => {
    try{
        const task =await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task) {
            res.status(404).send()
        }
        await task.remove()
        res.send(task)

     } catch(e){
         res.status(500).send(e)

    }


})


module.exports = router
