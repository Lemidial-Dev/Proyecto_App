document.addEventListener("DOMContentLoaded", () => {
    // Verificar si hay token, si no, redirigir a login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Lógica de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    // Lógica para mostrar productos
    const productosContainer = document.getElementById('productos-admin');
    let productosCargados = [];

    const API_URL = 'https://127.0.0.1:8000/api/productos'; // Cambia por la URL real de tu API

    async function cargarProductos() {
        const contenedor = document.getElementById('productos-admin');
        contenedor.innerHTML = ''; // Limpia antes de renderizar

        try {
            const respuesta = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const productos = await respuesta.json();

            productos.forEach(producto => {
                // Si el campo imagen es null, puedes mostrar una imagen por defecto
                const urlImagen = producto.imagen
                    ? `https://127.0.0.1:8000/storage/imagenes/${producto.imagen}`
                    : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

                contenedor.innerHTML += `
                    <div class="bg-[#23231f] rounded-lg overflow-hidden border border-[#3e3d32] flex flex-col">
                      <img src="${urlImagen}" alt="${producto.nombre}" class="w-full h-48 object-cover rounded-t-lg">
                      <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-[#e6db74] text-lg font-semibold">${producto.nombre}</h3>
                        <p class="text-[#f8f8f2] text-sm mb-2 flex-grow">${producto.descripcion || ''}</p>
                        <p class="text-[#fd971f] font-bold mb-4">$${producto.precio}</p>
                        <div class="botones flex gap-2 mt-auto">
                          <button class="btn-abi bg-[#fd971f] hover:bg-[#e6db74] text-[#272822] font-bold py-2 px-4 rounded transition-colors w-full" onclick="actualizarProducto('${producto.id}')">Actualizar</button>
                          <button class="btn-abi bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors w-full" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                        </div>
                      </div>
                    </div>
                `;
            });
        } catch (error) {
            contenedor.innerHTML = `<p class="text-red-500">Error al cargar productos.</p>`;
        }
    }

    // Ejemplo de uso (reemplaza esto por tu fetch real)
    const productos = [
        {
            id: 1,
            nombre: "Laptop MSI",
            descripcion: "Laptop de alto rendimiento",
            precio: 1200.50,
            imagen: "https://i.imgur.com/imagen1.jpg"
        },
        {
            id: 2,
            nombre: "Camisa Gato",
            descripcion: "Camisa con estampado de gato",
            precio: 25.99,
            imagen: "https://i.imgur.com/imagen2.jpg"
        }
    ];

    document.addEventListener("DOMContentLoaded", () => {
        renderProductosAdmin(productos);
    });

    // Funciones vacías para los botones (debes implementarlas)
    function actualizarProducto(id) {
        alert("Actualizar producto " + id);
    }
    function eliminarProducto(id) {
        alert("Eliminar producto " + id);
    }

    async function eliminarProducto(id) {
        if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            cargarProductos();
        } catch (error) {
            alert('Error al eliminar el producto');
        }
    }

    // Modal y formulario
    const modal = document.getElementById('modal-producto');
    const formProducto = document.getElementById('form-producto');
    const cerrarModalBtn = document.getElementById('cerrar-modal');
    const mensajeModal = document.getElementById('mensaje-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    let modoEdicion = false;
    let idProductoEditar = null;

    // Mostrar modal al dar clic en "Agregar producto"
    document.getElementById('agregar-producto-btn').addEventListener('click', () => {
        document.getElementById('modal-producto').classList.remove('hidden');
    });

    // Ocultar modal al dar clic en "Cancelar"
    document.getElementById('cerrar-modal').addEventListener('click', () => {
        document.getElementById('modal-producto').classList.add('hidden');
    });

    // Opcional: Ocultar modal al hacer clic fuera del formulario
    document.getElementById('modal-producto').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
        }
    });

    // Abrir modal para agregar
    document.getElementById('agregar-producto-btn').addEventListener('click', () => {
        modoEdicion = false;
        idProductoEditar = null;
        modalTitulo.textContent = "Agregar producto";
        formProducto.reset();
        mensajeModal.textContent = "";
        modal.classList.remove('hidden');
    });

    // Cerrar modal
    cerrarModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Subir imagen a Firebase y obtener URL
    async function subirImagenAFirebase(file) {
        const storageRef = firebase.storage().ref();
        const nombreUnico = `${Date.now()}_${file.name}`;
        const imagenRef = storageRef.child(`productos/${nombreUnico}`);
        await imagenRef.put(file);
        return await imagenRef.getDownloadURL();
    }

    // Guardar producto (agregar o actualizar)
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeModal.textContent = "Procesando...";
        const nombre = formProducto.nombre.value;
        const descripcion = formProducto.descripcion.value;
        const precio = formProducto.precio.value;
        const imagenFile = formProducto.imagen.files[0];

        let imagenUrl = "";

        // Si estamos editando y no se selecciona nueva imagen, conserva la anterior
        if (modoEdicion && idProductoEditar) {
            const producto = productosCargados.find(p => p.id == idProductoEditar);
            imagenUrl = producto?.image || producto?.imagen || "";
        }

        // Si hay nueva imagen, súbela a Firebase
        if (imagenFile) {
            try {
                imagenUrl = await subirImagenAFirebase(imagenFile);
            } catch (err) {
                mensajeModal.textContent = "Error al subir la imagen.";
                return;
            }
        }

        const datos = {
            nombre,
            descripcion,
            precio,
            imagen: imagenUrl
        };

        try {
            const token = localStorage.getItem('token');
            let url = "http://127.0.0.1:8000/api/productos";
            let method = "POST";
            if (modoEdicion && idProductoEditar) {
                url += `/${idProductoEditar}`;
                method = "PUT";
            }
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Aquí se usa el token
                },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al guardar el producto");
            mensajeModal.textContent = "Producto guardado correctamente";
            setTimeout(() => {
                modal.classList.add('hidden');
                cargarProductos();
            }, 1000);
        } catch (err) {
            mensajeModal.textContent = "Error al guardar el producto";
        }
    });

    // Abrir modal para editar producto
    productosContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('actualizar-btn')) {
            const producto = productosCargados.find(p => p.id == id);
            if (producto) {
                modoEdicion = true;
                idProductoEditar = id;
                modalTitulo.textContent = "Actualizar producto";
                formProducto.nombre.value = producto.nombre;
                formProducto.descripcion.value = producto.descripcion;
                formProducto.precio.value = producto.precio;
                mensajeModal.textContent = "";
                modal.classList.remove('hidden');
            }
        }
        if (e.target.classList.contains('eliminar-btn')) {
            eliminarProducto(id);
        }
    });

    cargarProductos();
});

async function obtenerYMostrarProductos() {
  const contenedor = document.getElementById('productos-admin');
  contenedor.innerHTML = '<p class="text-[#e6db74]">Cargando productos...</p>';
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/productos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data); // <-- Agrega esto
    if (data.rol !== 'admin') {
        mensaje.textContent = "Solo los administradores pueden iniciar sesión.";
        mensaje.classList.add("text-red-500");
        return;
    }
    if (!response.ok) throw new Error('No se pudieron cargar los productos');
    const productos = await response.json();
    renderProductosAdmin(productos);
  } catch (error) {
    contenedor.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
  }
}

function renderProductosAdmin(productos) {
  const contenedor = document.getElementById('productos-admin');
  contenedor.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'bg-[#23231f] rounded-xl shadow-lg p-4 border border-[#e6db74] flex flex-col items-center transition-transform hover:scale-105';
    div.innerHTML = `
      <div class="w-full h-48 flex items-center justify-center mb-4 bg-[#3e3d32] rounded overflow-hidden">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="object-contain h-full w-full" />
      </div>
      <h3 class="text-lg font-bold text-[#e6db74] mb-1 text-center">${producto.nombre}</h3>
      <p class="text-[#f8f8f2] mb-1 text-center text-sm">${producto.descripcion}</p>
      <p class="text-[#fd971f] font-bold mb-3 text-center">$${producto.precio}</p>
      <div class="flex gap-2 mt-auto">
        <button class="btn-abi" onclick="actualizarProducto('${producto.id}')">Actualizar</button>
        <button class="btn-abi" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

// Funciones para los botones (debes implementar la lógica real)
function actualizarProducto(id) {
  alert("Actualizar producto " + id);
}
function eliminarProducto(id) {
  alert("Eliminar producto " + id);
}