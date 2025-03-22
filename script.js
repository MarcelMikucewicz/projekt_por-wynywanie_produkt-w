const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware do obsługi JSON
app.use(bodyParser.json());

// Konfiguracja połączenia z MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Zmień na swoją nazwę użytkownika
    password: '', // Zmień na swoje hasło
    database: 'projekt_porownywanie' // Nazwa twojej bazy danych
});

// Połączenie z bazą
db.connect(err => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        return;
    }
    console.log('Połączono z bazą MySQL');
});

// Pobranie listy produktów dostępnych w sklepach
app.get('/api/products', (req, res) => {
    const query = `
        SELECT produkty.id, produkty.nazwa, produkty_sklepow.id_sklepu, sklepy.nazwa AS nazwa_sklepu, 
               produkty_sklepow.cena, produkty_sklepow.ilosc 
        FROM produkty 
        JOIN produkty_sklepow ON produkty.id = produkty_sklepow.id_produktu
        JOIN sklepy ON produkty_sklepow.id_sklepu = sklepy.id_sklepu`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd pobierania produktów:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.json(results);
    });
});

// Obsługa zamówień
app.post('/api/orders', (req, res) => {
    const { id_produktu, id_sklepu, imie_nazwisko, adres, telefon } = req.body;

    if (!id_produktu || !id_sklepu || !imie_nazwisko || !adres || !telefon) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    // Sprawdzenie dostępności produktu
    const checkStock = `SELECT ilosc FROM produkty_sklepow WHERE id_produktu = ? AND id_sklepu = ?`;
    db.query(checkStock, [id_produktu, id_sklepu], (err, results) => {
        if (err) {
            console.error('Błąd sprawdzania dostępności:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        if (results.length === 0 || results[0].ilosc <= 0) {
            return res.status(400).json({ error: 'Produkt niedostępny' });
        }

        // Wstawienie zamówienia do bazy
        const insertOrder = `
            INSERT INTO zamowienia (id_produktu, id_sklepu, imie_nazwisko, adres, telefon) 
            VALUES (?, ?, ?, ?, ?)`;

        db.query(insertOrder, [id_produktu, id_sklepu, imie_nazwisko, adres, telefon], (err) => {
            if (err) {
                console.error('Błąd składania zamówienia:', err);
                return res.status(500).json({ error: 'Błąd serwera' });
            }

            // Aktualizacja ilości produktów
            const updateStock = `UPDATE produkty_sklepow SET ilosc = ilosc - 1 WHERE id_produktu = ? AND id_sklepu = ?`;
            db.query(updateStock, [id_produktu, id_sklepu], (err) => {
                if (err) {
                    console.error('Błąd aktualizacji magazynu:', err);
                    return res.status(500).json({ error: 'Błąd serwera' });
                }
                res.json({ message: 'Zamówienie złożone' });
            });
        });
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});