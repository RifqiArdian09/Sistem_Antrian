import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Ticket } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    prefix: string;
    created_at: string;
    updated_at: string;
}

interface Queue {
    id: number;
    service_id: number;
    number: number;
    queue_code: string;
    status: string;
    customer_name?: string;
    created_at: string;
    service: Service;
}

interface Props {
    queues: {
        data: Queue[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    services: Service[];
}

export default function QueueIndex({ queues, services }: Props) {
    const [isLoading, setIsLoading] = useState<number | null>(null);

    const handleTakeQueue = (serviceId: number) => {
        setIsLoading(serviceId);
        router.post(`/queues/take/${serviceId}`, {}, {
            onFinish: () => setIsLoading(null),
        });
    };

    // Gunakan services yang dikirim dari controller
    // Jika tidak ada services, ambil dari queues sebagai fallback
    const availableServices = services && services.length > 0 ? services : 
        queues.data.reduce((acc: Service[], queue) => {
            if (!acc.find(s => s.id === queue.service.id)) {
                acc.push(queue.service);
            }
            return acc;
        }, []);

    // Hitung statistik per layanan
    const getServiceStats = (serviceId: number) => {
        const serviceQueues = queues.data.filter(q => q.service_id === serviceId);
        const waiting = serviceQueues.filter(q => q.status === 'waiting').length;
        const called = serviceQueues.filter(q => q.status === 'called').length;
        const completed = serviceQueues.filter(q => q.status === 'completed').length;
        
        return { waiting, called, completed, total: serviceQueues.length };
    };

    return (
        <AppLayout>
            <Head title="Ambil Nomor Antrian" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Sistem Antrian Digital
                        </h1>
                        <p className="text-lg text-gray-600">
                            Pilih layanan untuk mengambil nomor antrian Anda
                        </p>
                    </div>

                    {/* Layanan Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {availableServices.map((service) => {
                            const stats = getServiceStats(service.id);
                            return (
                                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Ticket className="h-5 w-5 text-blue-600" />
                                            {service.name}
                                        </CardTitle>
                                        <CardDescription>
                                            Kode: {service.prefix}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Statistik */}
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div className="text-center">
                                                    <div className="font-semibold text-orange-600">
                                                        {stats.waiting}
                                                    </div>
                                                    <div className="text-gray-500">Menunggu</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-blue-600">
                                                        {stats.called}
                                                    </div>
                                                    <div className="text-gray-500">Dipanggil</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-green-600">
                                                        {stats.completed}
                                                    </div>
                                                    <div className="text-gray-500">Selesai</div>
                                                </div>
                                            </div>

                                            {/* Tombol Ambil Antrian */}
                                            <Button
                                                onClick={() => handleTakeQueue(service.id)}
                                                disabled={isLoading === service.id}
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                                size="lg"
                                            >
                                                {isLoading === service.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Memproses...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Ticket className="h-4 w-4" />
                                                        Ambil Nomor Antrian
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Daftar Antrian Terbaru */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Antrian Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {queues.data.slice(0, 10).map((queue) => (
                                    <div
                                        key={queue.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="font-mono text-lg font-bold text-blue-600">
                                                {queue.queue_code}
                                            </div>
                                            <div>
                                                <div className="font-medium">{queue.service.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(queue.created_at).toLocaleTimeString('id-ID')}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                queue.status === 'waiting' ? 'secondary' :
                                                queue.status === 'called' ? 'default' : 'outline'
                                            }
                                        >
                                            {queue.status === 'waiting' ? 'Menunggu' :
                                             queue.status === 'called' ? 'Dipanggil' : 'Selesai'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
