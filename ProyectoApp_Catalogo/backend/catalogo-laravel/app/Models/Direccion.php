<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    protected $table = 'direcciones';

    protected $fillable = [
        'usuario_id',
        'direccion',
        'ciudad',
        'provincia',
        'telefono',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'direccion_id');
    }
}
