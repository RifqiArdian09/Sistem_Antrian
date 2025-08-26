<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Counter;
use App\Models\Service;

class CounterSeeder extends Seeder
{
    public function run(): void
    {
        // ambil service berdasarkan prefix
        $cs = Service::where('prefix', 'A')->first();
        $teller = Service::where('prefix', 'B')->first();
        $kredit = Service::where('prefix', 'C')->first();

        $counters = [
            ['name' => 'Loket CS 1', 'service_id' => $cs->id],
            ['name' => 'Loket CS 2', 'service_id' => $cs->id],
            ['name' => 'Loket Teller 1', 'service_id' => $teller->id],
            ['name' => 'Loket Teller 2', 'service_id' => $teller->id],
            ['name' => 'Loket Kredit 1', 'service_id' => $kredit->id],
        ];

        foreach ($counters as $counter) {
            Counter::create($counter);
        }
    }
}
