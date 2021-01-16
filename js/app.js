const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

window.onload = () => {
    consultarCriptomonedas();

    monedaSelect.addEventListener('change', leerValor);
    criptomonedasSelect.addEventListener('change', leerValor);

    formulario.addEventListener('submit', validarFormulario);
}

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    fetch(url)
        .then(res => res.json())
        .then(data => obtenerCriptomonedas(data.Data))
        .then(criptomonedas => selectCriptomoneda(criptomonedas))
}

const obtenerCriptomonedas = criptomonedas => {
    return new Promise(resolve => {
        resolve(criptomonedas);
    })
}

function selectCriptomoneda(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.append(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function validarFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarError(mensaje) {
    const existeError = document.querySelector('.error');
    if (!existeError) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('error');
        divAlerta.textContent = mensaje;
        formulario.appendChild(divAlerta);
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();
    fetch(url)
        .then(res => res.json())
        .then(data => {
            mostrarCotizacion(data.DISPLAY[criptomoneda][moneda]);
        })
}


function mostrarSpinner() {

    limpiarHtml();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `    
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}

function mostrarCotizacion(cotizacion) {
    limpiarHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioalto = document.createElement('p');
    precioalto.innerHTML = `El precio más alto del día <span>${HIGHDAY}</span>`;

    const preciobajo = document.createElement('p');
    preciobajo.innerHTML = `El precio más bajo del día <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioalto);
    resultado.appendChild(preciobajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}