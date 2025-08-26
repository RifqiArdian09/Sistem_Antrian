import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    prefix: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    service: Service;
}

export default function ServiceEdit({ service }: Props) {
    const [formData, setFormData] = useState({ 
        name: service.name, 
        prefix: service.prefix 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        router.put(`/services/${service.id}`, formData, {
            onSuccess: () => {
                // Redirect akan dilakukan otomatis oleh controller
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus layanan "${service.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            setIsDeleting(true);
            router.delete(`/services/${service.id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit Layanan - ${service.name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.get('/services')}
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Layanan
                        </Button>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Edit Layanan
                        </h1>
                        <p className="text-gray-600">
                            Perbarui informasi layanan "{service.name}"
                        </p>
                    </div>

                    {/* Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Save className="h-5 w-5 text-purple-600" />
                                Form Edit Layanan
                            </CardTitle>
                            <CardDescription>
                                Ubah informasi layanan sesuai kebutuhan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name">Nama Layanan *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })}
                                        placeholder="Contoh: Customer Service, Teller, Kredit"
                                        required
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Nama layanan yang akan ditampilkan kepada pengunjung
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="prefix">Kode Prefix *</Label>
                                    <Input
                                        id="prefix"
                                        type="text"
                                        value={formData.prefix}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            prefix: e.target.value.toUpperCase()
                                        })}
                                        placeholder="Contoh: A, B, C"
                                        maxLength={5}
                                        required
                                        className="mt-1 font-mono"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kode huruf untuk nomor antrian (contoh: A001, B001)
                                    </p>
                                </div>

                                {/* Preview */}
                                {formData.prefix && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">Preview Nomor Antrian:</h4>
                                        <div className="flex gap-2">
                                            <span className="bg-blue-100 px-3 py-1 rounded font-mono text-blue-800">
                                                {formData.prefix}001
                                            </span>
                                            <span className="bg-blue-100 px-3 py-1 rounded font-mono text-blue-800">
                                                {formData.prefix}002
                                            </span>
                                            <span className="bg-blue-100 px-3 py-1 rounded font-mono text-blue-800">
                                                {formData.prefix}003
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Service Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2">Informasi Layanan:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>ID: {service.id}</div>
                                        <div>Dibuat: {new Date(service.created_at).toLocaleString('id-ID')}</div>
                                        <div>Diperbarui: {new Date(service.updated_at).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.name || !formData.prefix}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-4 w-4" />
                                                Simpan Perubahan
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.get('/services')}
                                        disabled={isLoading || isDeleting}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-red-200">
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <Trash2 className="h-5 w-5" />
                                Zona Berbahaya
                            </CardTitle>
                            <CardDescription className="text-red-600">
                                Tindakan di bawah ini tidak dapat dibatalkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Hapus Layanan</h4>
                                    <p className="text-sm text-gray-600">
                                        Menghapus layanan akan menghapus semua data antrian terkait
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting || isLoading}
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menghapus...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Hapus Layanan
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
