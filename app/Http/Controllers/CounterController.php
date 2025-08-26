<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Service;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    public function index()
    {
        $queues = Queue::with('service')
            ->whereIn('status', ['waiting', 'called', 'completed'])
            ->orderBy('created_at')
            ->get();

        return inertia('counters/index', [
            'queues' => $queues
        ]);
    }

    public function call(Service $service)
    {
        $queue = Queue::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->orderBy('created_at')
            ->first();

        if ($queue) {
            $queue->update(['status' => 'called']);
            return back()->with('success', 'Memanggil nomor ' . $queue->queue_code);
        }

        return back()->with('error', 'Tidak ada antrian untuk layanan ' . $service->name);
    }
}
