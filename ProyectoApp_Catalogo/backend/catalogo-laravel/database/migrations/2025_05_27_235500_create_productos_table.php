<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Nombre del producto
            //$table->foreignId('categoria_id')->constrained()->onDelete('cascade');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2); // Precio del producto
            $table->string('imagen')->nullable(); // Ruta de la imagen del producto
            $table->string('stock')->default('disponible'); // Estado del stock: disponible, agotado, preorden
            $table->integer('cantidad')->default(0); // Cantidad disponible en stock

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
