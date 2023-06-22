/********* JS de la pagina que se imprime*********/

//Traigo mi lista de productos desde el storage
let productosTraidosDeStorageEnJson = localStorage.getItem("productos");
let arrayProductos = JSON.parse(productosTraidosDeStorageEnJson);
//Viculo con Html
const listaDefinitiva = document.getElementById("listaImprimir");
//Calculo total a pagar
const total = arrayProductos.reduce((acc, elemento)=>{
    return acc + elemento.cantidad * elemento.precio
}, 0).toLocaleString();

//Creo los elementos en el dom
const titulo = document.createElement("h2")
titulo.innerText= `Total dinero a llevar: $ ${total}`
listaDefinitiva.appendChild(titulo)

arrayProductos.forEach(element => {
    const p = document.createElement("p");
    p.innerHTML = `<input type="checkbox"> ${element.cantidad}${element.unidad} ${element.nombre} `;
    listaDefinitiva.appendChild(p);
});

//Ejecuto la opcion de imprimir
print();