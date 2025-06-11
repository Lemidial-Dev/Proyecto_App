<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::resource('productos', ProductController::class);

//Asocia la utl y metodo HTTP(GET, POST, PUT, DELETE) con el controlador

