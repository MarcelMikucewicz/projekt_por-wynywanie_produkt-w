document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('productSelect');
    const storeList = document.getElementById('storeList');
    const orderForm = document.getElementById('orderForm');
    const orderMessage = document.getElementById('orderMessage');

    let products = [];

    // Pobieranie listy produktów z backendu
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            const uniqueProducts = [...new Map(data.map(item => [item.id, item])).values()];
            
            uniqueProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.nazwa;
                productSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Błąd pobierania produktów:', err));

    // Obsługa wyboru produktu
    productSelect.addEventListener('change', () => {
        const selectedProductId = productSelect.value;
        storeList.innerHTML = '';

        if (selectedProductId) {
            const stores = products.filter(p => p.id == selectedProductId);
            
            stores.forEach(store => {
                const div = document.createElement('div');
                div.classList.add('store-item');
                div.textContent = `${store.nazwa_sklepu} - ${store.cena} zł (Ilość: ${store.ilosc})`;
                div.dataset.productId = store.id;
                div.dataset.storeId = store.id_sklepu;

                div.addEventListener('click', () => {
                    document.getElementById('selectedProductId').value = store.id;
                    document.getElementById('selectedStoreId').value = store.id_sklepu;
                    alert(`Wybrano sklep: ${store.nazwa_sklepu}`);
                });

                storeList.appendChild(div);
            });
        }
    });

    // Obsługa formularza zamówienia
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productId = document.getElementById('selectedProductId').value;
        const storeId = document.getElementById('selectedStoreId').value;
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerPhone = document.getElementById('customerPhone').value;

        if (!productId || !storeId) {
            alert('Wybierz produkt i sklep przed zamówieniem!');
            return;
        }

        fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_produktu: productId,
                id_sklepu: storeId,
                imie_nazwisko: customerName,
                adres: customerAddress,
                telefon: customerPhone
            })
        })
        .then(response => response.json())
        .then(data => {
            orderMessage.textContent = data.message || data.error;
        })
        .catch(err => console.error('Błąd zamówienia:', err));
    });
});