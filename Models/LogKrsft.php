<?php

namespace Modulos_ERP\LogsKrsft\Models;

use Illuminate\Database\Eloquent\Model;

class LogKrsft extends Model
{
    protected $table = 'logs_krsft';

    protected $fillable = [
        'action',
        'message',
        'level',
        'user_name',
        'module',
        'user_id',
        'ip_address',
        'extra',
        'performed_at',
    ];

    protected $casts = [
        'extra' => 'array',
        'performed_at' => 'datetime',
    ];
}
