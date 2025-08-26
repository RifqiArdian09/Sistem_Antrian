<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Queue;
use App\Models\Service;
use Carbon\Carbon;

class QueueSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $services = Service::all();

        foreach ($services as $service) {
            // bikin 5 antrian dummy per service
            for ($i = 1; $i <= 5; $i++) {
                $queueCode = $service->prefix . str_pad($i, 3, '0', STR_PAD_LEFT);
                
                Queue::create([
                    'service_id' => $service->id,
                    'number' => $i,
                    'queue_code' => $queueCode,
                    'status' => $i <= 2 ? 'waiting' : ($i == 3 ? 'called' : 'completed'),
                    'created_at' => $now->subMinutes(10 - $i),
                    'updated_at' => $now->subMinutes(10 - $i),
                ]);
            }
        }
    }
}
