// Szállások gomb eseménykezelő
document.getElementById('szallasokBtn').addEventListener('click', function(event) {
    event.preventDefault();
    fetchAndDisplaySzállások();
});

// Új szállás felvitele gomb eseménykezelő
document.getElementById('ujSzallasBtn').addEventListener('click', function(event) {
    event.preventDefault();
    displayNewSzállásForm();
});


// Szállások lekérése és kilistázása kártyákban
function fetchAndDisplaySzállások() {
    fetch('https://nodejs.sulla.hu/data')
    .then(response => response.json())
    .then(data => {
        let szállásokHTML = '<h2>Szállások</h2><div class="card-container">';
        data.forEach(szállás => {
            szállásokHTML += `
                <div class="card">
                    <h3>${szállás.name}</h3>
                    <p><strong>Helyszín:</strong> ${szállás.location}</p>
                    <p><strong>Ár:</strong> ${szállás.price}</p>
                    <button class="btn" onclick="deleteSzállás(${szállás.id})">Törlés</button>
                    <button class="btn" onclick="showDetails(${szállás.id})">Részletek</button>
                    <button class="btn" onclick="editSzállás(${szállás.id})">Módosítás</button>
                </div>`;
        });
        szállásokHTML += '</div>';
        document.getElementById('content').innerHTML = szállásokHTML;
    })
    .catch(error => console.error('Hiba történt:', error));
}


// Új szállás felvételi űrlap megjelenítése
function displayNewSzállásForm() {
    let formHTML = `
        <div id="newAccommodationForm">
            <h2>Új szállás felvitele</h2>
            <form id="accommodationForm">
                <label for="name">Név:</label><br>
                <input type="text" id="name" name="name" required><br>
                <label for="hostname">Host név:</label><br>
                <input type="text" id="hostname" name="hostname" required><br>
                <label for="location">Helyszín:</label><br>
                <input type="text" id="location" name="location" required><br>
                <label for="price">Ár:</label><br>
                <input type="number" id="price" name="price" required><br>
                <label for="minimum_nights">Minimum éjszakák száma:</label><br>
                <input type="number" id="minimum_nights" name="minimum_nights" required><br><br>
                <button type="submit" class="btn">Mentés</button>
            </form>
        </div>
    `;
    document.getElementById('content').innerHTML = formHTML;

   // Űrlap elküldése eseménykezelő
    document.getElementById('accommodationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const szállásData = {};

    // Űrlap adatainak begyűjtése és ellenőrzése
    let isValid = true;
    formData.forEach((value, key) => {
        if (value.trim() === '') {
            alert(`${key} mező nem lehet üres!`);
            isValid = false;
        }
        szállásData[key] = value;
    });

    // Ha minden mező kitöltve van, mentjük az új szállást
    if (isValid) {
        saveNewSzállás(szállásData);
    }
});

}

// Új szállás mentése
function saveNewSzállás(szállásData) {
    fetch('https://nodejs.sulla.hu/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(szállásData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Szállás sikeresen hozzáadva!');
        fetchAndDisplaySzállások();
    })
    .catch(error => console.error('Hiba történt:', error));
}


// Szállás törlése
function deleteSzállás(id) {
    fetch(`https://nodejs.sulla.hu/data/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert('Szállás sikeresen törölve!');
        fetchAndDisplaySzállások();
    })
    .catch(error => console.error('Hiba történt:', error));
}

// Részletek megjelenítése
function showDetails(id) {
    fetch(`https://nodejs.sulla.hu/data/${id}`)
    .then(response => response.json())
    .then(data => {
        displayDetails(data);
    })
    .catch(error => console.error('Hiba történt:', error));
}

// Részletek megjelenítése valamilyen formában (pl. modális ablak)
// Részletek megjelenítése
function showDetails(id) {
    fetch(`https://nodejs.sulla.hu/data/${id}`)
    .then(response => response.json())
    .then(data => {
        displayDetails(data);
    })
    .catch(error => console.error('Hiba történt:', error));
}

// Részletek megjelenítése valamilyen formában (pl. modális ablak)
function displayDetails(szállásData) {
    // A részletek megjelenítése modális ablakban
    let modalContent = `
        <div class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>Részletek</h2>
                <p><strong>Név:</strong> ${szállásData.name}</p>
                <p><strong>Host név:</strong> ${szállásData.hostname}</p>
                <p><strong>Helyszín:</strong> ${szállásData.location}</p>
                <p><strong>Ár:</strong> ${szállásData.price}</p>
                <p><strong>Minimum éjszakák száma:</strong> ${szállásData.minimum_nights}</p>
                <!-- Itt megjeleníthetsz további adatokat szükség szerint -->
                <button class="btn" id="goBackBtn">Vissza</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Vissza gomb eseménykezelője
    document.getElementById('goBackBtn').addEventListener('click', function() {
        closeModal();
        fetchAndDisplaySzállások(); // Visszatérés a szállások listájához
    });
}

// Modális ablak bezárása
function closeModal() {
    let modal = document.querySelector('.modal');
    modal.parentNode.removeChild(modal);
}



// Modális ablak bezárása
function closeModal() {
    let modal = document.querySelector('.modal');
    modal.parentNode.removeChild(modal);
}


// Szállás szerkesztése
// Szerkesztés gomb hozzáadása és eseménykezelő hozzáadása
function editSzállás(id) {
    fetch(`https://nodejs.sulla.hu/data/${id}`)
    .then(response => response.json())
    .then(data => {
        // Megjelenítjük az űrlapot a szerkesztendő adatokkal
        displayEditForm(data);
    })
    .catch(error => console.error('Hiba történt:', error));
}

// Szerkesztés űrlap megjelenítése
function displayEditForm(szállásData) {
    let formHTML = `
        <div id="editAccommodationForm">
            <h2>Szállás szerkesztése</h2>
            <form id="editForm">
                <input type="hidden" id="editId" name="id" value="${szállásData.id}">
                <label for="editName">Név:</label><br>
                <input type="text" id="editName" name="name" value="${szállásData.name}" required><br>
                <label for="editHostname">Host név:</label><br>
                <input type="text" id="editHostname" name="hostname" value="${szállásData.hostname}" required><br>
                <label for="editLocation">Helyszín:</label><br>
                <input type="text" id="editLocation" name="location" value="${szállásData.location}" required><br>
                <label for="editPrice">Ár:</label><br>
                <input type="number" id="editPrice" name="price" value="${szállásData.price}" required><br>
                <label for="editMinimum_nights">Minimum éjszakák száma:</label><br>
                <input type="number" id="editMinimum_nights" name="minimum_nights" value="${szállásData.minimum_nights}" required><br><br>
                <button type="submit" class="btn">Mentés</button>
                <button type="button" class="btn" onclick="cancelEdit()">Mégse</button>
            </form>
        </div>
    `;
    document.getElementById('content').innerHTML = formHTML;

    // Űrlap elküldése eseménykezelő
    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });

        // Szállás frissítése
        updateSzállás(updatedData);
    });
}

// Szállás frissítése
function updateSzállás(szállásData) {
    fetch(`https://nodejs.sulla.hu/data/${szállásData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(szállásData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Szállás sikeresen frissítve!');
        fetchAndDisplaySzállások(); // Adatok frissítése a módosítás után
    })
    .catch(error => console.error('Hiba történt:', error));
}


// Szerkesztés megszakítása (Visszatérés az eredeti nézethez)
function cancelEdit() {
    fetchAndDisplaySzállások();
}

// Újszállás hozzááadása
document.getElementById('newSzállásForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const szállásData = {};
    let isValid = true;

    // Ellenőrizzük az input mezőket
    formData.forEach((value, key) => {
        if (value.trim() === '') {
            alert(`${key} mező nem lehet üres!`);
            isValid = false;
        }
        szállásData[key] = value;
    });

    // Ha minden mező kitöltve van, mentjük az új szállást
    if (isValid) {
        saveNewSzállás(szállásData);
    }
});
// Int mezőkbe csak számok írhatóak
const intInputs = document.querySelectorAll('input[type="number"]');
intInputs.forEach(input => {
    input.addEventListener('input', function(event) {
        let value = event.target.value;
        // Csak számok engedélyezése
        let numericValue = value.replace(/\D/g, '');
        // Frissítjük az input mező értékét a csak számokat tartalmazó változattal
        event.target.value = numericValue;
    });
});