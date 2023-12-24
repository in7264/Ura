// Очікуємо завантаження DOM перед початком виконання скрипту
document.addEventListener("DOMContentLoaded", function () {
    // Відкриваємо вкладку з вказаним ім'ям
    openTab('addTabContent');
    // Оновлюємо список ліків
    updateMedicineList();
    // Оновлюємо дані з локального сховища
    updateFromLocalStorage();
});

// Функція для відкриття вкладки з вказаним ім'ям
function openTab(tabName) {
    // Закриваємо всі вкладки
    var tabs = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    // Відображаємо вкладку з вказаним ім'ям
    document.getElementById(tabName).style.display = "block";
}

// Функція для додавання нового ліку
function addMedicine() {
    // Отримуємо значення полів для нового ліку
    var medicineName = document.getElementById('medicineName').value;
    var quantity = document.getElementById('quantity').value;
    var price = document.getElementById('price').value;

    // Створюємо об'єкт для нового ліку
    var medicine = { name: medicineName, quantity: quantity, price: price };

    try {
        // Отримуємо та оновлюємо список ліків в локальному сховищі
        var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
        medicines.push(medicine);
        localStorage.setItem('medicines', JSON.stringify(medicines));
        updateMedicineList();
    } catch (error) {
        console.error('Помилка при парсингу JSON з локального сховища:', error);
    }
}

// Функція для оновлення списку ліків на сторінці
function updateMedicineList() {
    var medicineTableBody = document.getElementById('medicineList');
    medicineTableBody.innerHTML = '';

    try {
        // Отримуємо та виводимо список ліків з локального сховища
        var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
        medicines.forEach(function (medicine, index) {
            var row = medicineTableBody.insertRow();

            for (var i = 0; i < 3; i++) {
                var cell = row.insertCell(i);
                cell.innerHTML = i === 0 ? medicine.name : (i === 1 ? medicine.quantity : medicine.price);
            }

            var sellButton = document.createElement('button');
            sellButton.innerHTML = 'Продати';
            sellButton.onclick = function () {
                openSellDialog(medicine);
            };

            var cell4 = row.insertCell(3);
            cell4.appendChild(sellButton);
        });
    } catch (error) {
        console.error('Помилка при парсингу JSON з локального сховища:', error);
    }
}

// Функція для відкриття діалогового вікна продажу ліку
function openSellDialog(medicine) {
    // Отримуємо від користувача кількість для продажу
    var quantityToSell = prompt('Введіть кількість для продажу:', '1');
    if (quantityToSell !== null) {
        // Отримуємо від користувача ім'я та номер телефону покупця
        var customerName = prompt('Введіть ім\'я покупця:');
        var customerPhone = prompt('Введіть номер телефону покупця:');

        // Обчислюємо загальну суму продажу
        var totalAmount = quantityToSell * medicine.price;

        // Виводимо інформацію про продажу
        alert(`Ім'я покупця: ${customerName}\nНомер телефону: ${customerPhone}\nСума чеку: ${totalAmount} грн`);

        // Зменшуємо залишок ліку та оновлюємо його в локальному сховищі
        medicine.quantity -= quantityToSell;

        try {
            var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
            if (medicine.quantity <= 0) {
                medicines = medicines.filter(item => item.name !== medicine.name);
            } else {
                var index = medicines.findIndex(item => item.name === medicine.name);
                medicines[index] = medicine;
            }
            localStorage.setItem('medicines', JSON.stringify(medicines));
        } catch (error) {
            console.error('Помилка при парсингу JSON з локального сховища:', error);
        }

        // Оновлюємо список ліків та додаємо інформацію про продаж в список покупців
        updateMedicineList();
        updateCustomerList(customerName, customerPhone, medicine.name, quantityToSell, totalAmount);
    }
}

// Функція для оновлення списку покупців
function updateCustomerList(customerName, customerPhone, medicineName, quantity, totalAmount) {
    var customerList = document.getElementById('customerList');
    var listItem = document.createElement('li');

    // Перевірка на визначеність всіх параметрів
    if (customerName !== undefined && customerPhone !== undefined && medicineName !== undefined && quantity !== undefined && totalAmount !== undefined) {
        // Додаємо інформацію про продаж до списку покупців
        listItem.innerHTML = `<strong>${customerName}</strong> (${customerPhone}): Придбав(ла) ${quantity} одиниць ${medicineName}. Загальна сума: ${totalAmount} грн`;
        customerList.appendChild(listItem);

        // Отримуємо та оновлюємо список покупців в локальному сховищі
        var customers = JSON.parse(localStorage.getItem('customers')) || [];
        var customerInfo = { name: customerName, phone: customerPhone, medicine: medicineName, quantity: quantity, totalAmount: totalAmount };
        customers.push(customerInfo);
        localStorage.setItem('customers', JSON.stringify(customers));
    } else {
        console.error('Отримано невизначені параметри в updateCustomerList');
    }
}

// Функція для оновлення локального сховища інформацією про покупців
function updateLocalStorage(customerName, customerPhone, medicineName, quantity, totalAmount) {
    var customerList = document.getElementById('customerList');
    var listItem = document.createElement('li');

    // Перевірка на визначеність всіх параметрів
    if (customerName !== undefined && customerPhone !== undefined && medicineName !== undefined && quantity !== undefined && totalAmount !== undefined) {
        // Додаємо інформацію про продаж до списку покупців
        listItem.innerHTML = `<strong>${customerName}</strong> (${customerPhone}): Придбав(ла) ${quantity} одиниць ${medicineName}. Загальна сума: ${totalAmount} грн`;
        customerList.appendChild(listItem);

        // Отримуємо та оновлюємо список покупців в локальному сховищі
        var customers = JSON.parse(localStorage.getItem('customers')) || [];
        localStorage.setItem('customers', JSON.stringify(customers));
    } else {
        console.error('Отримано невизначені параметри в updateCustomerList');
    }
}

// Функція для оновлення списку покупців інформацією з локального сховища
function updateFromLocalStorage() {
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.forEach(function (customerInfo) {
        updateLocalStorage(customerInfo.name, customerInfo.phone, customerInfo.medicine, customerInfo.quantity, customerInfo.totalAmount);
    });
}

// Функція для пошуку ліку за назвою
function searchMedicine() {
    // Отримуємо введену користувачем назву ліку для пошуку
    var searchInput = document.getElementById('searchMedicine').value.toLowerCase();
    var medicineTableBody = document.getElementById('medicineList');

    // Знімаємо підсвічування з рядків
    clearHighlighting();

    // Отримуємо та шукаємо ліки в локальному сховищі
    var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
    var foundIndex = medicines.findIndex(medicine => medicine.name.toLowerCase().includes(searchInput));

    // Якщо лік знайдено, підсвічуємо його рядок та прокручуємо до нього
    if (foundIndex !== -1) {
        highlightRow(foundIndex);
        medicineTableBody.rows[foundIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('Товар не знайдено.');
    }
}

// Функція для підсвічування рядка у списку ліків
function highlightRow(index) {
    var medicineTableBody = document.getElementById('medicineList');
    medicineTableBody.rows[index].classList.add('highlighted-row');
}

// Функція для зняття підсвічування з усіх рядків списку ліків
function clearHighlighting() {
    var medicineTableBody = document.getElementById('medicineList');
    for (var i = 0; i < medicineTableBody.rows.length; i++) {
        medicineTableBody.rows[i].classList.remove('highlighted-row');
    }
}
