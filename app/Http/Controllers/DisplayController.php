<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Service;
use Illuminate\Http\Request;

class DisplayController extends Controller
{
    public function index()
    {
        $queues = Queue::with('service')
            ->whereIn('status', ['waiting', 'called'])
            ->orderBy('created_at')
            ->get();

        return inertia('display/index', [
            'queues' => $queues
        ]);
    }
}
