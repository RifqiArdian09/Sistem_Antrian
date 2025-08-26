<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return inertia('services/index', [
            'services' => Service::all()
        ]);
    }

    public function create()
    {
        return inertia('services/create');
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

    public function edit(Service $service)
    {
        return inertia('services/edit', [
            'service' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name'   => 'required|string|max:100',
            'prefix' => 'required|string|max:5'
        ]);

        $service->update($request->only('name', 'prefix'));

        return redirect()->route('services.index')->with('success', 'Layanan berhasil diperbarui');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Layanan berhasil dihapus');
    }
}
