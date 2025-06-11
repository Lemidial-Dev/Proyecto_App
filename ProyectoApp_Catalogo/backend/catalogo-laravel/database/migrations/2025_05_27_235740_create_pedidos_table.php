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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('carrito_id')->constrained('carritos')->onDelete('cascade');
            $table->foreignId('direccion_id')->constrained('direcciones')->onDelete('cascade');
            $table->decimal('total', 10, 2); // Total del pedido
            $table->string('estado')->default('pendiente'); // Estado del pedido: pendiente, completado, cancelado
            $table->dateTime('fecha_pedido')->useCurrent(); // Fecha y hora del pedido
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
