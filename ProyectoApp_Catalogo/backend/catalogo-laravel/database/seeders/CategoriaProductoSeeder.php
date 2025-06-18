<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Producto;

class CategoriaProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear categorías usando firstOrCreate
        $categorias = [
            ['nombre' => 'Electrónica', 'slug' => 'electronica'],
            ['nombre' => 'Ropa', 'slug' => 'ropa'],
            ['nombre' => 'Hogar', 'slug' => 'hogar'],
        ];

        foreach ($categorias as $catData) {
            Categoria::firstOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // Crear productos
        $productos = [
            [
                'nombre' => 'Laptop MSI',
                'descripcion' => 'Laptop de alto rendimiento',
                'precio' => 1200.50,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/proyexcto-app.firebasestorage.app/o/Imagenes%20proyecto%2Fmsi%20katana.jfif?alt=media&token=46d41d66-e70c-4de0-b2dc-88d449899794',
                'stock' => 10,
            ],
            [
                'nombre' => 'Camisa Gato',
                'descripcion' => 'Camisa de algodón',
                'precio' => 25.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/proyexcto-app.firebasestorage.app/o/Imagenes%20proyecto%2FCamiseta.jpg?alt=media&token=97ce8486-d22b-48ed-936a-b7d35c5fd6c3',
                'stock' => 50,
            ],
            [
                'nombre' => 'Sofá Extraño',
                'descripcion' => 'Sofá de diseño cómodo',
                'precio' => 499.99,
                'imagen' => 'https://firebasestorage.googleapis.com/v0/b/proyexcto-app.firebasestorage.app/o/Imagenes%20proyecto%2Fsofa-trepador.jpg?alt=media&token=5a450e07-1af3-4dd2-80ae-91d15819b172',
                'stock' => 5,
    
            ],
        ];

        foreach ($productos as $prodData) {
            $producto = Producto::firstOrCreate(
                ['nombre' => $prodData['nombre']],
                $prodData
            );

            // Asignar categorías aleatorias
            $categoriaIds = Categoria::inRandomOrder()->limit(rand(1, 2))->pluck('id')->toArray();
            $producto->categorias()->sync($categoriaIds);
        }
    }
}