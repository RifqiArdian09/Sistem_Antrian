import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Settings, Edit, Trash2 } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    prefix: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    services: Service[];
}

export default function ServiceIndex({ services }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [newService, setNewService] = useState({ name: '', prefix: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateService = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        router.post('/services', newService, {
            onSuccess: () => {
                setNewService({ name: '', prefix: '' });
                setIsCreating(false);
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleDeleteService = (serviceId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            router.delete(`/services/${serviceId}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Kelola Layanan" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Kelola Layanan
                            </h1>
                            <p className="text-gray-600">
                                Tambah, edit, atau hapus layanan antrian
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsCreating(true)}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Layanan
                        </Button>
                    </div>

                    {/* Form Tambah Layanan */}
                    {isCreating && (
                        <Card className="mb-6 border-purple-200">
                            <CardHeader className="bg-purple-50">
                                <CardTitle>Tambah Layanan Baru</CardTitle>
                                <CardDescription>
                                    Isi form di bawah untuk menambah layanan baru
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleCreateService} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Nama Layanan</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={newService.name}
                                                onChange={(e) => setNewService({
                                                    ...newService,
                                                    name: e.target.value
                                                })}
                                                placeholder="Contoh: Customer Service"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="prefix">Kode Prefix</Label>
                                            <Input
                                                id="prefix"
                                                type="text"
                                                value={newService.prefix}
                                                onChange={(e) => setNewService({
                                                    ...newService,
                                                    prefix: e.target.value.toUpperCase()
                                                })}
                                                placeholder="Contoh: A"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsCreating(false);
                                                setNewService({ name: '', prefix: '' });
                                            }}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Daftar Layanan */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-purple-600" />
                                            <CardTitle className="text-lg">
                                                {service.name}
                                            </CardTitle>
                                        </div>
                                        <Badge variant="secondary" className="font-mono">
                                            {service.prefix}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Dibuat: {new Date(service.created_at).toLocaleDateString('id-ID')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-600">
                                            <strong>Kode Antrian:</strong> {service.prefix}001, {service.prefix}002, dst.
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => router.get(`/services/${service.id}/edit`)}
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {services.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Belum ada layanan
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Tambahkan layanan pertama untuk memulai sistem antrian
                                </p>
                                <Button
                                    onClick={() => setIsCreating(true)}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Layanan
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
