<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'usuario_id',
        'direccion_id',
        'total',
        'estado',
        'fecha_pedido',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class);
    }

    public function pedidoProductos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio');
    }

}
