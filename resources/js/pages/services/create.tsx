import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ServiceCreate() {
    const [formData, setFormData] = useState({ name: '', prefix: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        router.post('/services', formData, {
            onSuccess: () => {
                // Redirect akan dilakukan otomatis oleh controller
            },
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Layanan Baru" />
            
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
                            Tambah Layanan Baru
                        </h1>
                        <p className="text-gray-600">
                            Buat layanan baru untuk sistem antrian
                        </p>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-purple-600" />
                                Form Layanan Baru
                            </CardTitle>
                            <CardDescription>
                                Isi informasi layanan yang akan ditambahkan
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
                                                <Plus className="h-4 w-4" />
                                                Simpan Layanan
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.get('/services')}
                                        disabled={isLoading}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
