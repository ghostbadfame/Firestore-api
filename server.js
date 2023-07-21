const express = require("express");
const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const admin = require("firebase-admin");
const credentials = require ("./secret-key.json")

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});

const db = admin.firestore();
 
app.post('/create',async(req,res)=>{
     try{
        
        const id = req.body.email;
        
        const userJson={
            email: req.body.email, 
            userName:req.body.userName
        };
        const response = await db.collection("users").doc(id).set(userJson);
        // if we dont want to use email as id we can use random id generated by firestore using this line of code
        // const response = db.collection("users").add(userJson);
        res.send(response);
     }
     catch(e){
        res.send(e);
     }
})

app.get('/read/all',async(req,res)=>{
    try {
        const userRef = db.collection("users");
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc =>{
            responseArr.push(doc.data());
        })
        res.send(responseArr)
    } catch (error) {
        console.log(error);
    }
})

app.post('/update',async(req,res)=>{
    try{
       
       const id = req.body.email;
       
       const userJson={
           email: req.body.email, 
           userName:req.body.userName
       };
       const response = await db.collection("users").doc(id).update(userJson);
       // if we dont want to use email as id we can use random id generated by firestore using this line of code
       // const response = db.collection("users").add(userJson);
       console.log("sd");
       res.send(response);
    }
    catch(e){
       res.send(e);
    }
})

app.get('/read/:id',async(req,res)=>{
    try {
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data()); 
    } catch (error) {
        console.log(error);
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try {
        const userRef = db.collection("users").doc(req.params.id).delete();
        res.send(userRef)
    } 
    catch (error) {
        console.log(error);
}});




const PORT = 8000

app.listen(PORT , ()=>{
    console.log(`Server is running on ${PORT}`);
})