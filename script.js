const express = require("express")
const mysql = require("mysql")
 
const app = express()
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "projekt_porownywanie"
})
 
conn.connect((err)=>{
    if(err){
        console.log("nie połączono z bazą")
    } else{
        console.log("połaczono z bazą")
    }
})
 