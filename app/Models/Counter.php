<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Counter extends Model
{
    protected $fillable = ['name', 'service_id'];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function queues()
    {
        return $this->hasMany(Queue::class);
    }
}
