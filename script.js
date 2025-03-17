const express = require("express")
const mysql = require("mysql")
const cors = requiere("cors")
 
const app = express()
app.use(express.json())
app.use(cors())
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
app.get('/api/produkty', (req, res)=>{
    const query =`SELECT produkty.id, produkty.nazwa, produkty_sklepow.id_sklepu, sklepy.nazwa AS nazwa_sklepu, produkty_sklepow.cena, produkty_sklepow.ilosc
    FROM produkty JOIN produkty_sklepow ON produkty.id=produkty_sklepow.id_produktu
    JOIN sklepy ON produkty_sklepow.id_sklepu = sklepy.id_sklepu`
    database.query(query, (err, results)=>{
        if(err){
            console.log('Błąd pobierania produktów: ', err)
            return res.status(500).json({error:err.message});
            }
            res.json(results)
    })
   
})
 app.post('/api/orders', (req, res)=>{
    const  {id_produktu, id_sklepu, imie_klienta, adres, nr_telefonu, ilosc} = req.body;
    if(!id_produktu||!id_sklepu||!imie_klienta||!adres||!nr_telefonu||!ilosc){
        return res.status(400).json({error:'Wszystkie pola są wymagane'})
    }
    const sprawdzIlosc = `SELECT ilosc FROM produkty_sklepow WHERE id_produktu = ? AND id_sklepu = ?`
    database.query(sprawdzIlosc, [id_produktu, id_sklepu], (err,results)=>{
        if(results.length === 0 || results[0].ilosc<=0){
            return res.status(400).json({error: 'Produkt niedostępny'})
        }
    })
 })