let productosTraidosDeStorageEnJson = localStorage.getItem("productos");
let arrayProductos = JSON.parse(productosTraidosDeStorageEnJson);

const listaDefinitiva = document.getElementById("listaImprimir");
const total = arrayProductos.reduce((acc, elemento)=>{
    return acc + elemento.cantidad * elemento.precio
}, 0);
const titulo = document.createElement("h2")
titulo.innerText= `Total dinero a llevar: ${total} pesos`
listaDefinitiva.appendChild(titulo)
arrayProductos.forEach(element => {
    const p = document.createElement("p");
    p.innerHTML = `<input type="checkbox"> ${element.cantidad}${element.unidad} ${element.nombre} `;
    listaDefinitiva.appendChild(p);
});
print();