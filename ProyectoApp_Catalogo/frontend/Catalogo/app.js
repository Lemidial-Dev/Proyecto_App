const inputBusqueda = document.getElementById("buscador");
const contenedorCategorias = document.getElementById("categorias");
const contenedorProductos = document.getElementById("productos");
 
let Productos = [];
let categoriasSeleccionada = "all";
 
// Lógica de login y productos
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
 
    // LOGIN SOLO PARA ADMIN
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
 
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const mensaje = document.getElementById("mensaje");
            try {
                const response = await fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
 
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
 
                const data = await response.json();
                if (data.rol !== 'admin') {
                    mensaje.textContent = "Solo los administradores pueden iniciar sesión.";
                    mensaje.classList.add("text-red-500");
                    return;
                }
                localStorage.setItem("token", data.token);
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.classList.add("text-green-500");
 
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 1000);
 
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                mensaje.textContent = "Error al iniciar sesión. Verifica tus credenciales.";
                mensaje.classList.add("text-red-500");
            }
        });
    }
 
    // Lógica de catálogo público
    if (contenedorProductos && contenedorCategorias && inputBusqueda) {
        cargarProductos();
        cargarCategorias();
        inputBusqueda.addEventListener("input", filtrarProductos);
    }
 
    // Botón de login visible solo si no hay token
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        if (localStorage.getItem('token')) {
            loginBtn.style.display = 'none';
        } else {
            loginBtn.style.display = 'block';
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }
 
    // Botón de logout (si existe)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});
 
// Cargar productos desde tu backend (catálogo público, sin token)
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
 
// Cargar categorías desde tu backend
async function cargarCategorias() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/categorias");
        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
        const categorias = await respuesta.json();
        mostrarCategorias(["all", ...categorias]);
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}
 
// Filtrar productos por categoría y búsqueda
function filtrarProductos() {
    let filtrados = Productos;
    if (categoriasSeleccionada !== "all") {
        filtrados = filtrados.filter((p) => p.categoria === categoriasSeleccionada);
    }
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
 
// Mostrar categorías
function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = "";
    categorias.forEach((cat) => {
        const btn = document.createElement("button");
        btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.dataset.categoria = cat;
        btn.className = "categoria-btn" + (categoriasSeleccionada === cat ? " categoria-btn-activa" : "");
        btn.classList.add('btn-abi');
        btn.addEventListener("click", () => {
            categoriasSeleccionada = cat;
            mostrarCategorias(categorias);
            filtrarProductos();
        });
        contenedorCategorias.appendChild(btn);
    });
}
 
// Mostrar productos (catálogo público)
function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'bg-[rgba(53,41,28,0.85)] rounded-2xl shadow-lg p-6 border-2 border-[#3e3d32] flex flex-col items-center';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="h-32 mb-4 object-contain bg-[#232323] rounded-lg p-4" />
            <h3 class="text-lg font-bold text-[#e6db74] mb-2 text-center">${producto.nombre}</h3>
            <a href="detalle.html?id=${producto.id}" class="btn-abi mt-2">Ver detalles</a>
        `;
        contenedor.appendChild(div);
    });
}