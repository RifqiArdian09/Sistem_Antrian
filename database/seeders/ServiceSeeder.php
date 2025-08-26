<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'Customer Service', 'prefix' => 'A'],
            ['name' => 'Teller', 'prefix' => 'B'],
            ['name' => 'Kredit', 'prefix' => 'C'],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
