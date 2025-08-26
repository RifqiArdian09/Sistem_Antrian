<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return inertia('Services/Index', [
            'services' => Service::all()
        ]);
    }

    public function create()
    {
        return inertia('Services/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100',
            'prefix' => 'required|string|max:5'
        ]);

        Service::create($request->only('name', 'prefix'));

        return redirect()->route('services.index')->with('success', 'Layanan berhasil ditambahkan');
    }
}
