<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\DisplayController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Routes antrian
    Route::get('/queues', [QueueController::class, 'index'])->name('queues.index');
    Route::post('/queues/take/{service}', [QueueController::class, 'store'])->name('queues.store');
    Route::post('/queues/{queue}/complete', [QueueController::class, 'complete'])->name('queues.complete');

    // Counter (loket)
    Route::get('/counters', [CounterController::class, 'index'])->name('counters.index');
    Route::post('/counters/call/{service}', [CounterController::class, 'call'])->name('counters.call');

    // Display antrian
    Route::get('/display', [DisplayController::class, 'index'])->name('display.index');

    // Services (jika ada admin manage layanan)
    Route::resource('services', ServiceController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
