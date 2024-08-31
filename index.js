import express from 'express';
import {config} from 'dotenv';
import pool from './db/dbconnection.js';
import router from './routes/UserRoute.js';
config();

const port = process.env.port || 3002;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({extended: true}));
app.use(express.json());

pool.getConnection((err,connection)=>{
    if(err){
        throw err;
    }
    console.log(`Database is connected`)
    connection.release();
})

app.use('',router);


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
});