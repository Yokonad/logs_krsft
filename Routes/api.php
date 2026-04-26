<?php

use Illuminate\Support\Facades\Route;

$moduleName = basename(dirname(__DIR__));
$ctrl = "Modulos_ERP\\{$moduleName}\\Controllers\\LogController";

Route::get('/list', "{$ctrl}@list");
Route::get('/stats', "{$ctrl}@stats");
Route::get('/modules', "{$ctrl}@modules");
Route::post('/create', "{$ctrl}@store");
Route::delete('/{id}', "{$ctrl}@destroy");
