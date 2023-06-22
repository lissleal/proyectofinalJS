//Lista de Compras

/******Vinculo HTML con JS *******/
const opcionesCategorias = document.getElementById("selectOpciones")
const opcionesProductos = document.getElementById("selectProducto")
const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const botonImprimir = document.getElementById("botonImprimir");
const formularioNuevo = document.getElementById("formularioNuevo");

//Creo una clase para crear las categorias
class Categoria {
    constructor(nombre){
        this.nombre = nombre;
        this.productos = [];
    }
}

//Creo una clase para crear los productos
class Producto {
    constructor(cantidad, nombre, precio, unidad, id){
        this.cantidad = cantidad;
        this.nombre = nombre;
        this.precio = precio;
        this.unidad = unidad;
        this.id = id;
    }
}

//Inicializo mis arrays
let arrayCategorias = [];
let arrayProductos = [];

/**********Recuperar datos del storage *********/
let productosTraidosDeStorageEnJson = localStorage.getItem("productos");
let productosTraidosDeStorage = JSON.parse(productosTraidosDeStorageEnJson);

//Inicializo
revisarStorage();
imprimirProductos();

//Uso fetch para traer mi lista de posibles productos desde archivo Json
const url = "./productos.json";
fetch(url)
    .then(response => response.json())
    .then(data => {
        crearCategorias(data)   
        crearOpciones();  
    })

/************** FUNCIONES *************/

//Función para iniciar variables segun storage
function revisarStorage(){
    arrayProductos = productosTraidosDeStorage ?? arrayProductos;
  }

//Funcion para Actualizar storage
function actualizarStorage(){
    const productosParaEnviarStorageEnJson = JSON.stringify(arrayProductos);
    localStorage.setItem("productos", productosParaEnviarStorageEnJson);
  }

//Filtrar los datos la API simulada y llenar arraycategorias
function crearCategorias(data) {
    data.forEach((producto) => {
        const categoriaExistente = arrayCategorias.find((categoria) => 
        categoria.nombre === producto.CATEGORIA);
        
        if(categoriaExistente) {
            categoriaExistente.productos.push(producto);
        }else {
            const nuevaCategoria = new Categoria(producto.CATEGORIA);
            nuevaCategoria.productos.push(producto);
            arrayCategorias.push(nuevaCategoria);
        }     
    });
}


//Usar array Categorias para Alimentar opciones de select de categorias
function crearOpciones() {
    for (const categoria of arrayCategorias) {
        const opcion = document.createElement("option");
        opcion.value = categoria.nombre;
        opcion.textContent = categoria.nombre;
        opcionesCategorias.appendChild(opcion);
    }
}

//Según la categoria selecionada se crean las opciones de productos
function crearProductos(){
    opcionesProductos.innerHTML=``;
    const value = opcionesCategorias.value;
    const index = arrayCategorias.findIndex((el) => el.nombre === value);
    
    arrayCategorias[index].productos.forEach(element => {
        const opcion = document.createElement("option");
        opcion.innerHTML = `                    
                    <option value="${element.PRODUCTO}">${element.PRODUCTO}</option>
                        `;
        opcionesProductos.appendChild(opcion);
    });   
}


//Funcion que recoja los datos del formulario y agregue producto a carrito
function agregarProducto(e) {
    e.preventDefault();
    revisarStorage();

    //recogo variables
    const producto = document.getElementById("selectProducto").value;
    const categoria = document.getElementById("selectOpciones").value;
    //Busco index categoria
    const index = arrayCategorias.findIndex((el) => el.nombre === categoria);
    //Busco index producto
    const index2 = arrayCategorias[index].productos.findIndex((el) => el.PRODUCTO === producto);
    let id = arrayCategorias[index].productos[index2].ID;
    //Revisar si ya esta en carrito
    const comprobar=arrayProductos.some((el) => el.nombre===producto);
    if (comprobar){
        sumarProducto(id);
    }else{
        //Busco en el array mis valores
        let precio = arrayCategorias[index].productos[index2].PRECIO;
        let unidad = arrayCategorias[index].productos[index2].UNIDAD;
        //creo nuevo producto
        const productoSeleccionado = new Producto(1, producto, precio, unidad, id);
        arrayProductos.push(productoSeleccionado);
    }
    actualizarStorage();
    imprimirProductos();
}

function agregarProductoNuevo (e) {
    e.preventDefault();
  
    //Recupero datos del formulario
    const inputNombre = document.getElementById("inputNombreNuevo");
    const inputPrecio = document.getElementById("inputPrecioNuevo");
    const inputCantidad = document.getElementById("inputCantidadNuevo");
    const inputUnidad = document.getElementById("inputUnidadNuevo");
    const inputCategoria = document.getElementById("inputCategoriaNuevo");
  
    // Convierto las cadenas de texto a números y mayusculas
    const nombre = inputNombre.value.toUpperCase();
    const precio = parseFloat(inputPrecio.value);
    const cantidad = parseFloat(inputCantidad.value);
    const unidad = inputUnidad.value.toUpperCase();
    const categoria = inputCategoria.value.toUpperCase();
    const id = `${nombre}-${categoria}`
    // Verifico si los valores son números válidos
    if (isNaN(precio) || isNaN(cantidad)|| nombre=="" || categoria=="") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Parece que te faltan algunos datos',
            footer: 'Asegúrate de ingresar nombre, categoria y valores numéricos válidos'
          })
      return;
    }
    // Verifico si el producto esta en la lista
    const repetido= arrayProductos.some((element) =>{
        return element.nombre===nombre;
    })
    if (repetido){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El producto ya existe',
            footer: 'Agrégalo desde el panel de categorias o aumenta su cantidad directamente en la lista'
          })
        formularioNuevo.reset();
    }else{
        //Creo nuevo producto
        const nuevoProducto = new Producto (cantidad, nombre, precio, unidad, id);
        //Lo agrego a mi array
        arrayProductos.push(nuevoProducto);
    
        //Actualizo valores
        actualizarStorage();
        imprimirProductos();
        //Borro los valores del formulario
        formularioNuevo.reset();
    }
  }

//Funcion para mostrar productos elegidos en pantalla
function imprimirProductos(){
    //Borro lo que esta en pantalla para que no se duplique
    lista.innerHTML = [];
    revisarStorage();
    //Recorro el array creo un li por cada producto
    arrayProductos.forEach(element => {
        const li = document.createElement("li");
        li.className = "productito";
        li.innerHTML = `
        <p class="">${element.cantidad}</p>
        <p class="">${element.unidad}</p>
        <p class="">${element.nombre}</p>
        <p class="">${element.precio}</p>
        <p class="">${element.cantidad*element.precio}</p>
        <div>
        <button id="${element.id}" class="botonesSumar">⬆️</button>
        <button id="${element.id}" class="botonesRestar">⬇️</button>
        <button id="${element.id}" class="botonesEliminar">❌</button>
        </div>
                        `
        lista.appendChild(li);
        // Obtener todos los elementos con la clase "botonesEliminar"
        const botonEliminar = li.querySelector(".botonesEliminar");
        botonEliminar.addEventListener("click", (e) => {
            const idSeleccionada = e.currentTarget.id;
            eliminarProducto(idSeleccionada);
        })
        // Obtener todos los elementos con la clase "botonesSumar"
        const botonSumar = li.querySelector(".botonesSumar");
        botonSumar.addEventListener("click", (e) => {
            const idSeleccionada = e.currentTarget.id;
            sumarProducto(idSeleccionada);
        })
        //Obtener todos los elementos con la clase "botonesRestar"
        const botonRestar = li.querySelector(".botonesRestar");
        botonRestar.addEventListener("click", (e) => {
            const idSeleccionada = e.currentTarget.id;
            restarProducto(idSeleccionada);
        })
    });
}


//Funcion para eliminar productos
function eliminarProducto(id){
    const index = arrayProductos.findIndex((producto) => producto.id === id);
    if (index !== -1) {
        arrayProductos.splice(index, 1);
        actualizarStorage();
        imprimirProductos();
    }
}

//Funcion para sumar productos
function sumarProducto(id){
    const index = arrayProductos.findIndex((producto) => producto.id === id);
    if (index !== -1){
        arrayProductos[index].cantidad++;
        actualizarStorage();
        imprimirProductos();
    }
}
//Funcion para restar productos
function restarProducto(id){
    const index = arrayProductos.findIndex((producto) => producto.id === id);
    if (index !== -1){
        if(arrayProductos[index].cantidad !== 1){
            arrayProductos[index].cantidad--;
            actualizarStorage();
            imprimirProductos();
        } else {
            eliminarProducto(id);
        }
    }
}

//Funcion para imprimir Lista
function confirmarLista(){
    //uso un reduce para calcular el total del monto necesario
    const total = arrayProductos.reduce((acc, elemento)=>{
        return acc + elemento.cantidad * elemento.precio
    }, 0).toLocaleString();
    //Uso un alert para indicarle al usuario el resumen de su lista y si la desea imprimir
    Swal.fire({
        title: '<strong>Terminaste tu Lista de Compras</strong>',
        icon: 'success',
        html:
          'Para comprar todos tus productos necesitas: <br> $ ' + total,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText:
          'Imprimir',
         cancelButtonText:
           'Seguir Editando'
      }).then((result)=>{
        //Si confirma lo envío la pagina de impresion
        if(result.isConfirmed){
            window.open("./lista.html", "_self");            
        }
      })
}


/************** EVENTOS *************/
opcionesCategorias.addEventListener("change", crearProductos);
formulario.addEventListener("submit", agregarProducto);
formularioNuevo.addEventListener("submit", agregarProductoNuevo);
botonImprimir.addEventListener("click", confirmarLista)