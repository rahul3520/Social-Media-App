import { mongoDBURL, PORT } from "./config.js";
import mongoose from 'mongoose';
import express from "express";
import { User, Discuss } from "./models/userModel.js";

// Creating express object
const app = express();

app.use(express.json());

// Handling GET request
app.get('/', (req, res) => { 
    res.send('A simple Node App is '
        + 'running on this server') 
    res.end() 
}) 

//add new user to mongoDb collection users
app.post('/add/user',async(req,response) => {

    try{
        if( !req.body.Name ||
            !req.body.MobileNo ||
            !req.body.Email
        ){
            res.status(400).send({message: "Send all the required fields - Name, MobileNo and Email"});
        }

        const user={
            userName: req.body.Name,
            mobileNo: req.body.MobileNo,
            email: req.body.Email,
        };

        const newUser = await User.create(user);

        return response.status(201).send(newUser);

    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
    
    
});

//get all users
app.get('/get/users', async(request,response) => {

    try{

        const result = await User.find();

        if(!result){

            return response.status(404).json({message: "No users found"});
        }

        return response.status(200).send(result);


    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message})
    }
});

//find user by name
app.get('/get/userByName', async(request,response) => {

    try{

        if(!request.body.userName){
            return response.status(400).send({messsage: "user name is a required field!!!"});
        }

        const result = await User.findOne({userName: request.body.userName});

        if(!result){

            return response.status(404).json({message: "No users found by the given name!"});
        }

        return response.status(200).send(result);


    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message})
    }
});

//update user in existing user collection
app.put('/update/user/:userId', async(request,response) => {

    try{
        if(
            !request.body.userName||
            !request.body.mobileNo||
            !request.body.email
        ){
            return response.status(400).send({message:"Send all required fiels - Name , Mobile No and Email"})
        }

        const { userId } = request.params;

        const result = await User.findByIdAndUpdate(userId,request.body);

        if(!result){
            return response.status(404).json({message:"User not found"});
        }

        return response.status(200).send({message: "User updated successfully"});

    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
});

//delete existing user from user collection
app.delete('/delete/user/:userId', async(request,response) => {

    try{
        const { userId } = request.params;

        const result = await User.findByIdAndDelete(userId);

        if(!result){

            return response.status(404).json({message: "User not found !!!"});
        }

        return response.status(200).send({message:"User deleted successfully"});

    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
}); 

//user adding a discussion to collection discussion
app.post('/add/discussion', async(request,response) => {

    try{

        if(!request.body.email){
            return response.status(400).send({message: "user email is a required field!"});
        }

        const discuss = {
            userEmail: request.body.email,
            textField: request.body.text,
            imageUrl: request.body.image,
            hashTags: request.body.tags,
        }

        const newDiscuss = await Discuss.create(discuss);

        return response.status(201).send(newDiscuss);

    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
}
);

//update discussion posted by user
app.put('/update/discussion/:discussionId', async(request,response) => {

    try{

        if(!request.body.userEmail){
            return response.status(400).send({message: "user email is a required field!"});
        }

        const { discussionId } = request.params;

        const result = await Discuss.findByIdAndUpdate(discussionId,request.body);

        if(!result){
            return response.status(404).json({message: "discussion not found"});
        }

        return response.status(201).send({message:"discussion updated successfully!"});

    }catch(error){

        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
}
);

  mongoose
    .connect(mongoDBURL,{
        autoIndex: true,
    })
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT,() => { 
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });