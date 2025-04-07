async function loadProducts() {
    const response = await fetch('http://localhost:3000/produkty/');
    const products = await response.json();
    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = '<option value="">Wybierz produkt</option>';
    products.forEach(product => {
        productSelect.innerHTML += `<option value="${product.id}">${product.nazwa}</option>`;
    });
}

document.getElementById('productSelect').addEventListener('change', async function() {
    const productId = this.value;
    if (!productId) return;
    
    const response = await fetch(`http://localhost:3000/produkty/${productId}`);
    const stores = await response.json();
    
    const storeSelect = document.getElementById('storeSelect');
    storeSelect.innerHTML = '';
    stores.forEach(store => {
        storeSelect.innerHTML += `<option value="${store.id_sklepu}" data-price="${store.cena}" data-available="${store.ilosc}">${store.nazwa} - ${store.cena} PLN (Dostępne: ${store.ilosc})</option>`;
    });
    document.getElementById('storeOptions').style.display = 'block';
});

async function orderProduct() {
    const productId = document.getElementById('productSelect').value;
    const storeId = document.getElementById('storeSelect').value;
    const quantity = document.getElementById('quantity').value;
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    if (!productId || !storeId || !quantity || !name || !address || !phone) {
        alert('Wypełnij wszystkie pola!');
        return;
    }

    const orderData = {
        id_produktu: productId,
        id_sklepu: storeId,
        imie_klienta: name,
        adres: address,
        nr_telefonu: phone,
        ilosc: quantity
    };

    try {
        const response = await fetch('http://localhost:3000/zamowienie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Błąd podczas zamawiania:', error);
        alert('Wystąpił problem przy składaniu zamówienia.');
    }
}

loadProducts();
