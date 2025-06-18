<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',      // Estado (string)
        'imagen',
    ];

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_producto');
    }

    public function carritoProductos()
    {
        return $this->belongsToMany(Carrito::class, 'carrito_productos');
    }
}
