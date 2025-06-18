const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("busqueda");
const contenedorCategorias = document.getElementById("categorias");

let Productos = [];
let categoriasSeleccionada = "all";

document.addEventListener("DOMContentLoaded", () => {
    // Lógica de login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const mensaje = document.getElementById("mensaje");
            try {
                const response = await fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: username, password }),
                });
                if (!response.ok) throw new Error("Error en la respuesta de la API");
                const data = await response.json();
                localStorage.setItem("token", data.token || data.access_token);
                localStorage.setItem("rol", data.user.rol);

                setTimeout(() => {
                    if (data.user.rol === "admin") {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "index.html";
                    }
                }, 1500);
            } catch (error) {
                mensaje.textContent = "Error al iniciar sesión. Verifica tus credenciales.";
                mensaje.classList.add("text-red-500");
            }
        });
    }

    // Lógica de productos y categorías
    if (contenedorProductos && contenedorCategorias && inputBusqueda) {
        cargarProductos();
        cargarCategorias();
        inputBusqueda.addEventListener("input", filtrarProductos);
    }

    // Menú hamburguesa y cerrar sesión
    const menuBtn = document.getElementById("menuBtn");
    const menuDropdown = document.getElementById("menuDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            menuDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", function(event) {
            if (!menuBtn.contains(event.target) && !menuDropdown.contains(event.target)) {
                menuDropdown.classList.add("hidden");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            window.location.href = "login.html";
        });
    }

    // Detalle de producto
    if (window.location.pathname.endsWith('detalle.html')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const contenedor = document.getElementById('detalleProducto');
        if (!id) {
            contenedor.innerHTML = '<p>No se encontró el producto.</p>';
        } else {
            fetch(`http://127.0.0.1:8000/api/productos/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo cargar el producto");
                    return res.json();
                })
                .then(producto => {
                    contenedor.innerHTML = `
                        <h2 class="text-2xl font-bold mb-4">${producto.nombre}</h2>
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-64 h-64 object-contain mx-auto mb-4">
                        <p class="mb-2"><strong>Descripción:</strong> ${producto.descripcion}</p>
                        <p class="mb-2"><strong>Precio:</strong> $${producto.precio}</p>
                        <p class="mb-2"><strong>Stock:</strong> ${producto.stock}</p>
                        <a href="index.html" class="bg-[#e6db74] text-[#23231f] hover:bg-[#fd971f] text-white px-4 py-2 rounded">Volver</a>
                    `;
                })
                .catch(() => {
                    contenedor.innerHTML = '<p>Error al cargar el producto.</p>';
                });
        }
    }
});

// Lógica de productos
async function cargarProductos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/productos");
        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
        const productos = await respuesta.json();
        Productos = productos;
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

async function cargarCategorias() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/categories");
        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
        const categorias = await respuesta.json();
        mostrarCategorias(["all", ...categorias]);
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

function filtrarProductos() {
    let filtrados = Productos;
    // Filtrar por categoría (ajusta si tus productos tienen otro campo)
    if (categoriasSeleccionada !== "all") {
        filtrados = filtrados.filter((p) => p.categoria === categoriasSeleccionada);
    }
    // Filtrar por texto de búsqueda
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
        filtrados = filtrados.filter(
            (p) =>
                p.nombre.toLowerCase().includes(texto) ||
                p.descripcion.toLowerCase().includes(texto)
        );
    }
    mostrarProductos(filtrados);
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";
        productoDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-2 text-center" style="color: #111111;">${producto.nombre}</h3>
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-32 h-32 object-contain mb-4">
            <p class="text-gray-700 mb-2 text-center">${producto.descripcion}</p>
            <p class="text-gray-800 mb-2 font-bold">Precio: $${producto.precio}</p>
            <p class="text-gray-600 mb-2">Stock: ${producto.stock}</p>
            <a href="detalle.html?id=${producto.id}" class="mt-auto bg-[#e6db74] hover:bg-[#fd971f] text-white px-4 py-2 rounded text-center">Ver detalle</a>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}