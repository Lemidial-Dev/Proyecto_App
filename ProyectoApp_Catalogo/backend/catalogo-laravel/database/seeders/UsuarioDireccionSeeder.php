<?php

namespace Database\Seeders;

use Iluminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Direccion;
use Illuminate\Support\Facades\Hash;

class UsuarioDireccionSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuario admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@tienda.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'rol' => 'admin',
            ]
        );

        // Crear usuario cliente
        $cliente = User::firstOrCreate(
            ['email' => 'cliente@tienda.com'],
            [
                'name' => 'Cliente User',
                'password' => Hash::make('cliente123'),
                'rol' => 'cliente',
            ]
        );

        // Agregar direcciones usando firstOrCreate
        Direccion::firstOrCreate(
            ['usuario_id' => $admin->id, 'direccion' => 'Av. Central 123'],
            [
                'ciudad' => 'Quito',
                'provincia' => 'Pichincha',
                'telefono' => '0987654321',
            ]
        );

        Direccion::firstOrCreate(
            ['usuario_id' => $cliente->id, 'direccion' => 'Calle Falsa 456'],
            [
                'ciudad' => 'Guayaquil',
                'provincia' => 'Guayas',
                'telefono' => '0976543210',
            ]
        );
    }
}