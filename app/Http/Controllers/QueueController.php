<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Service;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    // Tampilkan daftar antrian
    public function index()
    {
        $queues = Queue::with('service')
            ->latest()
            ->paginate(10);

        // Ambil semua services untuk ditampilkan
        $services = Service::all();
        
        return inertia('queues/index', [
            'queues' => $queues,
            'services' => $services
        ]);
    }

    // Ambil nomor antrian baru
    public function store(Service $service)
    {
        // Cari nomor terakhir untuk service ini
        $lastQueue = Queue::where('service_id', $service->id)
            ->latest('id')
            ->first();

        $nextNumber = $lastQueue ? $lastQueue->number + 1 : 1;
        $queueNumber = $service->prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        $queue = Queue::create([
            'service_id' => $service->id,
            'number'     => $nextNumber,
            'queue_code' => $queueNumber,
            'status'     => 'waiting',
        ]);

        return redirect()->back()->with('success', 'Nomor antrian Anda: ' . $queueNumber);
    }

    // Selesaikan antrian
    public function complete(Queue $queue)
    {
        $queue->update(['status' => 'completed']);
        
        return redirect()->back()->with('success', 'Antrian ' . $queue->queue_code . ' telah diselesaikan');
    }
}
