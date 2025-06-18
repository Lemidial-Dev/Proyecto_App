const API_URL = "http://127.0.0.1:8000/api/productos";
const token = localStorage.getItem("token");

async function cargarProductos() {
    const res = await fetch(API_URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    const productos = await res.json();
    mostrarProductos(productos);
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = productos.map(producto => `
        <div class="relative flex flex-col items-center justify-start bg-[#35352b] rounded-3xl w-full max-w-xs min-h-[420px] mx-auto shadow-[0_2px_8px_#0006] transition-all cursor-pointer overflow-hidden outline-none p-8 pb-6 hover:shadow-[0_8px_32px_#fd971f55,0_2px_8px_#000a] hover:bg-[#272822] focus-within:shadow-[0_8px_32px_#fd971f55,0_2px_8px_#000a] focus-within:bg-[#272822] z-10">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-28 h-28 object-cover object-center rounded-full bg-[#232323] mb-5 shadow-[0_0_0_4px_#fd971f88] z-10" />
            <h3 class="text-[#fd971f] font-bold mt-2 mb-1 text-center">${producto.nombre}</h3>
            <p class="text-[#e6db74] text-lg mb-2 text-center">${producto.descripcion}</p>
            <p class="text-[#e6db74] text-base mb-2 text-center">Stock: <span class="text-[#a6e22e] font-semibold">${producto.stock}</span></p>
            <p class="text-[#fd971f] font-semibold mb-2 text-center">$${producto.precio}</p>
            <div class="flex gap-2 mt-auto mb-2">
                <button class="btn-editar bg-[rgba(53,41,28,0.92)] text-[#e6db74] border-2 border-[#e6db74] rounded-2xl px-4 py-1 font-semibold hover:bg-[#e6db74] hover:text-[#23231f] hover:border-[#fd971f] transition-all" data-id="${producto.id}">Editar</button>
                <button class="btn-eliminar bg-[#f92672] text-[#f8f8f2] border-2 border-[#f92672] rounded-2xl px-4 py-1 font-semibold hover:bg-[#e6db74] hover:text-[#23231f] hover:border-[#fd971f] transition-all" data-id="${producto.id}">Eliminar</button>
            </div>
        </div>
    `).join('');

    // Después de renderizar los productos:
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            editarProducto(id);
        });
    });

    // Selecciona todos los botones eliminar y agrega el evento
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.dataset.id;
            console.log("Intentando eliminar producto con id:", id); // <-- Agrega esto
            if (confirm('¿Seguro que deseas eliminar este producto?')) {
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (!res.ok) throw new Error("No se pudo eliminar");
                    location.reload();
                } catch (err) {
                    alert("Error: " + err.message);
                }
            }
        });
    });
}

window.editarProducto = function(id) {
    window.location.href = `editar.html?id=${id}`;
};

cargarProductos();