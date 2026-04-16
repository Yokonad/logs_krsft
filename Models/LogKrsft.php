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
    ];
}
