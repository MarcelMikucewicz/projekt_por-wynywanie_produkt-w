const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;
const util = require('util');


app.use(express.json());
app.use(cors());


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  
  password: '',  
  database: 'projekt_porownywanie'  
});


const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};


app.get('/produkty', async (req, res) => {
  try {
    const products = await query('SELECT * FROM produkty');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania produktów.' });
  }
});

app.get("/addsklep/:nazwa", (req, res)=>{
  const nazwa = req.params.nazwa

  const sql = `INSERT INTO sklepy (nazwa) VALUES ('${nazwa}')`

  console.log(sql);
  conn.query(sql, (err, dane, info)=>{
      if(err){
          console.log(err);
          res.send("nie udało się zapisać danych")
      }else{
          res.send("dodano rekord")
      }
  })
})
app.get("/addprodukt/:nazwa", (req, res)=>{
  const nazwa = req.params.nazwa

  const sql = `INSERT INTO produkty (nazwa) VALUES ('${nazwa}')`

  console.log(sql);
  conn.query(sql, (err, dane, info)=>{
      if(err){
          console.log(err);
          res.send("nie udało się zapisać danych")
      }else{
          res.send("dodano rekord")
      }
  })
})
app.get("/addproduktysklepow/:id_sklepu/:id_produktu/:cena/:ilosc", (req, res)=>{
  const id_sklepu = req.params.id_sklepu
  const id_produktu = req.params.id_produktu
  const cena = req.params.cena
  const ilosc = req.params.ilosc

  const sql = `INSERT INTO produkty_sklepow (id_sklepu, id_produktu, cena, ilosc) VALUES ('${id_sklepu}','${id_sklepu}','${cena}','${ilosc}')`

  console.log(sql);
  conn.query(sql, (err, dane, info)=>{
      if(err){
          console.log(err);
          res.send("nie udało się zapisać danych")
      }else{
          res.send("dodano rekord")
      }
  })
})
app.get("/update/:id/:ilosc", (req, res)=>{
  const id= req.params.id
  const ilosc = req.params.ilosc

  const sql = `UPDATE produkty_sklepow SET ilosc = '${ilosc}' WHERE Id = '${id_sklepu}';`

  console.log(sql);
  conn.query(sql, (err, dane, info)=>{
      if(err){
          console.log(err);
          res.send("nie udało się zapisać danych")
      }else{
          res.send("dodano rekord")
      }
  })
})
app.get('/produkty/:id', async (req, res) => {
  const productId = req.params.id;

  try {
 
    const productStores = await query(`
      SELECT ps.id_sklepu, s.nazwa, ps.cena, ps.ilosc 
      FROM produkty_sklepow ps
      JOIN sklepy s ON ps.id_sklepu = s.id
      WHERE ps.id_produktu = ?`, [productId]);

    res.json(productStores);
  } catch (error) {
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania sklepów.' });
  }
});


 
app.post('/zamowienie', async (req, res) => {
  const { id_produktu, id_sklepu, imie_klienta, adres, nr_telefonu, ilosc } = req.body;

  try {
  
    await query(`
      INSERT INTO zamowienia (id_produktu, id_sklepu, imie_klienta, adres, nr_telefonu, ilosc)
      VALUES (?, ?, ?, ?, ?, ?)`, [id_produktu, id_sklepu, imie_klienta, adres, nr_telefonu, ilosc]);

    res.json({ message: 'Zamówienie złożone pomyślnie!' });
  } catch (error) {
    res.status(500).json({ error: 'Wystąpił błąd podczas składania zamówienia.' });
  }
});


app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
