let originalSiglas = [];
let addedSiglas = JSON.parse(localStorage.getItem('addedSiglas')) || [];
let siglas = [];

// Cargar siglas desde el archivo JSON
async function loadSiglas() {
    try {
        const response = await fetch('siglas.json');
        if (response.ok) {
            const data = await response.json();
            originalSiglas = data.siglas;
            siglas = [...originalSiglas, ...addedSiglas];
            displayResults(siglas);
        } else {
            console.error('No se pudo cargar el archivo JSON');
            siglas = addedSiglas;
            displayResults(siglas);
        }
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        siglas = addedSiglas;
        displayResults(siglas);
    }
}

// Mostrar resultados de búsqueda
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No se encontraron siglas. ¿Deseas añadir una nueva?</p>';
        document.getElementById('addForm').style.display = 'block';
        return;
    }

    results.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'sigla-entry';
        entryDiv.innerHTML = `
            <h3>${entry.sigla}</h3>
            <p><strong>Definición:</strong> ${entry.definicion}</p>
            ${entry.unidad ? `<p><strong>Unidad:</strong> ${entry.unidad}</p>` : ''}
            ${entry.ejemplo ? `<p><strong>Ejemplo:</strong> ${entry.ejemplo}</p>` : ''}
        `;
        resultsDiv.appendChild(entryDiv);
    });
}

// Buscar siglas
function searchSiglas() {
    const searchTerm = document.getElementById('searchInput').value.trim().toUpperCase();
    if (!searchTerm) {
        displayResults(siglas);
        return;
    }

    const filtered = siglas.filter(sigla =>
        sigla.sigla.toUpperCase().includes(searchTerm) ||
        sigla.definicion.toUpperCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        displayResults([]);
    } else {
        displayResults(filtered);
    }
}

// Añadir nueva sigla
function addNewSigla(event) {
    event.preventDefault();
    const newSigla = {
        sigla: document.getElementById('newSigla').value.trim().toUpperCase(),
        definicion: document.getElementById('newDefinicion').value.trim(),
        unidad: document.getElementById('newUnidad').value.trim(),
        ejemplo: document.getElementById('newEjemplo').value.trim()
    };

    // Verificar si ya existe
    if (siglas.some(s => s.sigla === newSigla.sigla)) {
        alert('Esta sigla ya existe.');
        return;
    }

    // Añadir a addedSiglas y siglas
    addedSiglas.push(newSigla);
    siglas.push(newSigla);

    // Guardar en localStorage
    localStorage.setItem('addedSiglas', JSON.stringify(addedSiglas));

    // Limpiar el formulario
    document.getElementById('newSiglaForm').reset();

    // Ocultar el formulario y mostrar los resultados
    document.getElementById('addForm').style.display = 'none';
    displayResults([newSigla]);
}

// Event listeners
document.getElementById('searchButton').addEventListener('click', searchSiglas);
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchSiglas();
    }
});
document.getElementById('newSiglaForm').addEventListener('submit', addNewSigla);

// Cargar siglas al inicio
loadSiglas();
