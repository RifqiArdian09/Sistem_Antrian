<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    protected $fillable = ['name', 'prefix'];

    public function counters()
    {
        return $this->hasMany(Counter::class);
    }

    public function queues()
    {
        return $this->hasMany(Queue::class);
    }
}
