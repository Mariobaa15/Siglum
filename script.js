document.addEventListener('DOMContentLoaded', () => {
    loadSiglas();
});

function loadSiglas() {
    fetch('siglas.json')
        .then(response => response.json())
        .then(data => {
            displaySiglas(data);
        });
}

function displaySiglas(siglas) {
    const container = document.getElementById('siglas-container');
    container.innerHTML = '';
    siglas.sort((a, b) => a.sigla.localeCompare(b.sigla)).forEach(sigla => {
        const div = document.createElement('div');
        div.className = 'sigla';
        div.innerHTML = `<strong>${sigla.sigla}</strong>: ${sigla.definicion} ${sigla.unidad ? `(${sigla.unidad})` : ''}`;
        container.appendChild(div);
    });
}

function searchSigla() {
    const query = document.getElementById('search').value.toLowerCase();
    fetch('siglas.json')
        .then(response => response.json())
        .then(data => {
            const filteredSiglas = data.filter(sigla => sigla.sigla.toLowerCase().includes(query));
            displaySiglas(filteredSiglas);
        });
}

function addSigla() {
    const newSigla = document.getElementById('new-sigla').value;
    const newDefinicion = document.getElementById('new-definicion').value;
    const newUnidad = document.getElementById('new-unidad').value;

    if (newSigla && newDefinicion) {
        fetch('siglas.json')
            .then(response => response.json())
            .then(data => {
                data.push({ sigla: newSigla, definicion: newDefinicion, unidad: newUnidad });
                fetch('siglas.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(() => {
                    loadSiglas();
                    document.getElementById('new-sigla').value = '';
                    document.getElementById('new-definicion').value = '';
                    document.getElementById('new-unidad').value = '';
                });
            });
    } else {
        alert('Por favor, completa todos los campos.');
    }
}
