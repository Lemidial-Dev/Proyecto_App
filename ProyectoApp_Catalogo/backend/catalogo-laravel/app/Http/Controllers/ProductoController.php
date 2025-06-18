<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    
    public function index()
    {
        //Listar todos los productos
        return Producto::with('categorias')->get();
    }

    
    public function create()
    {
        
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'required|integer|min:0',      // Estado (ej: disponible, agotado)
            'categorias' => 'nullable|array', //IDs de categorias
        ]);
        
        $producto = DB::transaction(function () use ($validated, $request) {
            $producto = Producto::create($validated);

            if ($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
            }
            
            return $producto;
        });
        return response()->json($producto, 201);
    }

    
    public function show($id)
    {
        $producto = Producto::with('categorias')->findOrFail($id);
        return response()->json($producto);
    }

    
    public function edit(Producto $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric',
            'imagen' => 'nullable|string',
            'stock' => 'required|integer|min:0',      // Estado (ej: disponible, agotado)
            'categorias' => 'nullable|array', //IDs de categorias
        ]);
        // Validar los datos del formulario
        
        $producto->update($validated);
        // Actualizar el producto con los datos validados
        
        if ($request->has('categorias')) {
            $producto->categorias()->sync($request->input('categorias'));
        }
        //Si se envían categorías, sincronizarlas con el producto

        return response()->json($producto, 200);
        //Devolver el producto actualizado
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();
        //Eliminar el producto por ID

        return response()->json(['mensaje' => 'Producto eliminado correctamente'], 204);
        //Devolver una respuesta vacía con código 204
    }
}
