document.addEventListener("DOMContentLoaded", function () {
    openTab('addTabContent');
    updateMedicineList();
    updateFromLocalStorage();
});

function openTab(tabName) {
    var tabs = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    document.getElementById(tabName).style.display = "block";


}

function addMedicine() {
    var medicineName = document.getElementById('medicineName').value;
    var quantity = document.getElementById('quantity').value;
    var price = document.getElementById('price').value;

    var medicine = {
        name: medicineName,
        quantity: quantity,
        price: price
    };

    try {
        var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
        medicines.push(medicine);
        localStorage.setItem('medicines', JSON.stringify(medicines));

        updateMedicineList();
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
    }
}

function updateMedicineList() {
    var medicineTableBody = document.getElementById('medicineList');
    medicineTableBody.innerHTML = '';

    try {
        var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
        medicines.forEach(function (medicine, index) {
            var row = medicineTableBody.insertRow();

            var cell1 = row.insertCell(0);
            cell1.innerHTML = medicine.name;

            var cell2 = row.insertCell(1);
            cell2.innerHTML = medicine.quantity;

            var cell3 = row.insertCell(2);
            cell3.innerHTML = medicine.price;

            var cell4 = row.insertCell(3);
            var sellButton = document.createElement('button');
            sellButton.innerHTML = 'Продати';
            sellButton.onclick = function () {
                openSellDialog(medicine);
            };
            cell4.appendChild(sellButton);
        });
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
    }
}

function openSellDialog(medicine) {
    var quantityToSell = prompt('Введіть кількість для продажу:', '1');
    if (quantityToSell !== null) {
        var customerName = prompt('Введіть ім\'я покупця:');
        var customerPhone = prompt('Введіть номер телефону покупця:');

        var totalAmount = quantityToSell * medicine.price;

        alert(`Ім'я покупця: ${customerName}\nНомер телефону: ${customerPhone}\nСума чеку: ${totalAmount} грн`);

        medicine.quantity -= quantityToSell;

        if (medicine.quantity <= 0) {
            try {
                var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
                medicines = medicines.filter(function (item) {
                    return item.name !== medicine.name;
                });
                localStorage.setItem('medicines', JSON.stringify(medicines));
            } catch (error) {
                console.error('Error parsing JSON from localStorage:', error);
            }
        } else {
            try {
                var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
                var index = medicines.findIndex(item => item.name === medicine.name);
                medicines[index] = medicine;
                localStorage.setItem('medicines', JSON.stringify(medicines));
            } catch (error) {
                console.error('Error parsing JSON from localStorage:', error);
            }
        }

        updateMedicineList();
        updateCustomerList(customerName, customerPhone, medicine.name, quantityToSell, totalAmount);
    }
}

function updateCustomerList(customerName, customerPhone, medicineName, quantity, totalAmount) {
    var customerList = document.getElementById('customerList');
    var listItem = document.createElement('li');

    if (customerName !== undefined && customerPhone !== undefined && medicineName !== undefined && quantity !== undefined && totalAmount !== undefined) {
        listItem.innerHTML = `<strong>${customerName}</strong> (${customerPhone}): Придбав(ла) ${quantity} одиниць ${medicineName}. Загальна сума: ${totalAmount} грн`;
        customerList.appendChild(listItem);

        var customers = JSON.parse(localStorage.getItem('customers')) || [];
        var customerInfo = {
            name: customerName,
            phone: customerPhone,
            medicine: medicineName,
            quantity: quantity,
            totalAmount: totalAmount
        };
        customers.push(customerInfo);
        localStorage.setItem('customers', JSON.stringify(customers));
    } else {
        console.error('Undefined parameters received in updateCustomerList');
    }
}

function updateLocalStorage(customerName, customerPhone, medicineName, quantity, totalAmount) {
    var customerList = document.getElementById('customerList');
    var listItem = document.createElement('li');

    if (customerName !== undefined && customerPhone !== undefined && medicineName !== undefined && quantity !== undefined && totalAmount !== undefined) {
        listItem.innerHTML = `<strong>${customerName}</strong> (${customerPhone}): Придбав(ла) ${quantity} одиниць ${medicineName}. Загальна сума: ${totalAmount} грн`;
        customerList.appendChild(listItem);

        var customers = JSON.parse(localStorage.getItem('customers')) || [];
        localStorage.setItem('customers', JSON.stringify(customers));
    } else {
        console.error('Undefined parameters received in updateCustomerList');
    }
}

function updateFromLocalStorage() {
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.forEach(function (customerInfo) {
        updateLocalStorage(customerInfo.name, customerInfo.phone, customerInfo.medicine, customerInfo.quantity, customerInfo.totalAmount);
    });
}

// Додайте цю функцію для виклику при натисканні кнопки пошуку
function searchMedicine() {
    var searchInput = document.getElementById('searchMedicine').value.toLowerCase();
    var medicineTableBody = document.getElementById('medicineList');

    clearHighlighting();

    var medicines = JSON.parse(localStorage.getItem('medicines')) || [];
    var foundIndex = -1;

    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].name.toLowerCase().includes(searchInput)) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex !== -1) {
        highlightRow(foundIndex);
        medicineTableBody.rows[foundIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('Товар не знайдено.');
    }
}

function highlightRow(index) {
    var medicineTableBody = document.getElementById('medicineList');
    medicineTableBody.rows[index].classList.add('highlighted-row');
}

function clearHighlighting() {
    var medicineTableBody = document.getElementById('medicineList');
    for (var i = 0; i < medicineTableBody.rows.length; i++) {
        medicineTableBody.rows[i].classList.remove('highlighted-row');
    }
}
