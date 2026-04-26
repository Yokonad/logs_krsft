<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs_krsft', function (Blueprint $table) {
            $table->id();
            $table->string('action', 120);
            $table->text('message');
            $table->string('level', 30)->default('info');
            $table->string('user_name', 120)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_krsft');
    }
};
