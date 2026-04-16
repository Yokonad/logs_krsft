<?php

use Illuminate\Support\Facades\Route;

$moduleName = basename(dirname(__DIR__));
$ctrl = "Modulos_ERP\\{$moduleName}\\Controllers\\LogController";

Route::get('/list', "{$ctrl}@list");
Route::post('/create', "{$ctrl}@store");
Route::delete('/{id}', "{$ctrl}@destroy");
