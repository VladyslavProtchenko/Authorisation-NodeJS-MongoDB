const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 3500


const app = express()
mongoose.set('strictQuery', false);

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.583umm7.mongodb.net/ulbi-tv?retryWrites=true&w=majority')
        app.listen(PORT, ()=>{
            console.log(`server started on port: ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();