<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('logs_krsft', function (Blueprint $table) {
            // Módulo origen del evento (ej: 'auth', 'compraskrsft', 'inventariokrsft')
            $table->string('module', 60)->nullable()->after('user_name');

            // ID del usuario que disparó el evento
            $table->unsignedBigInteger('user_id')->nullable()->after('module');

            // IP del cliente al momento del evento
            $table->string('ip_address', 45)->nullable()->after('user_id');

            // Datos adicionales en JSON libre (route, model_id, etc.)
            $table->json('extra')->nullable()->after('ip_address');

            // Momento exacto del evento (puede diferir de created_at si se registra async)
            $table->timestamp('performed_at')->nullable()->after('extra');

            // Índices para filtros frecuentes
            $table->index('module');
            $table->index('user_id');
            $table->index('level');
            $table->index('performed_at');
        });
    }

    public function down(): void
    {
        Schema::table('logs_krsft', function (Blueprint $table) {
            $table->dropIndex(['module']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['level']);
            $table->dropIndex(['performed_at']);
            $table->dropColumn(['module', 'user_id', 'ip_address', 'extra', 'performed_at']);
        });
    }
};
