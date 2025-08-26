import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Phone, CheckCircle, Clock, Users } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    prefix: string;
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
    queues: Queue[];
}

export default function CounterIndex({ queues }: Props) {
    const [isLoading, setIsLoading] = useState<number | null>(null);
    const [completingQueue, setCompletingQueue] = useState<number | null>(null);

    const handleCallNext = (serviceId: number) => {
        setIsLoading(serviceId);
        router.post(`/counters/call/${serviceId}`, {}, {
            onFinish: () => setIsLoading(null),
        });
    };

    const handleCompleteQueue = (queueId: number) => {
        setCompletingQueue(queueId);
        router.post(`/queues/${queueId}/complete`, {}, {
            onFinish: () => setCompletingQueue(null),
        });
    };

    // Group antrian berdasarkan layanan
    const groupedQueues = queues.reduce((acc, queue) => {
        const serviceId = queue.service_id;
        if (!acc[serviceId]) {
            acc[serviceId] = {
                service: queue.service,
                waiting: [],
                called: [],
                completed: []
            };
        }
        
        if (queue.status === 'waiting') {
            acc[serviceId].waiting.push(queue);
        } else if (queue.status === 'called') {
            acc[serviceId].called.push(queue);
        } else if (queue.status === 'completed') {
            acc[serviceId].completed.push(queue);
        }
        
        return acc;
    }, {} as Record<number, { 
        service: Service; 
        waiting: Queue[]; 
        called: Queue[]; 
        completed: Queue[] 
    }>);

    // Urutkan antrian menunggu berdasarkan waktu dibuat
    Object.values(groupedQueues).forEach(group => {
        group.waiting.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        group.called.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        group.completed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    return (
        <AppLayout>
            <Head title="Panel Petugas Loket" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Panel Petugas Loket
                        </h1>
                        <p className="text-gray-600">
                            Kelola antrian dan panggil nomor berikutnya
                        </p>
                    </div>

                    {/* Service Cards */}
                    <div className="space-y-6">
                        {Object.values(groupedQueues).map(({ service, waiting, called, completed }) => (
                            <Card key={service.id} className="shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">
                                                {service.name}
                                            </CardTitle>
                                            <CardDescription className="text-blue-100">
                                                Kode: {service.prefix}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{waiting.length}</div>
                                                <div>Menunggu</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{called.length}</div>
                                                <div>Dipanggil</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{completed.length}</div>
                                                <div>Selesai</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-6">
                                    <div className="grid lg:grid-cols-3 gap-6">
                                        {/* Antrian Menunggu */}
                                        <div>
                                            <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Menunggu ({waiting.length})
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {waiting.slice(0, 5).map((queue, index) => (
                                                    <div
                                                        key={queue.id}
                                                        className={`p-3 rounded-lg border ${
                                                            index === 0 
                                                                ? 'bg-yellow-50 border-yellow-200' 
                                                                : 'bg-gray-50 border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-mono font-bold text-lg">
                                                                {queue.queue_code}
                                                            </div>
                                                            {index === 0 && (
                                                                <Badge className="bg-yellow-500">
                                                                    Selanjutnya
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(queue.created_at).toLocaleTimeString('id-ID')}
                                                        </div>
                                                    </div>
                                                ))}
                                                {waiting.length > 5 && (
                                                    <div className="text-center text-gray-500 text-sm">
                                                        +{waiting.length - 5} lainnya
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Tombol Panggil Selanjutnya */}
                                            <Button
                                                onClick={() => handleCallNext(service.id)}
                                                disabled={waiting.length === 0 || isLoading === service.id}
                                                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                                                size="lg"
                                            >
                                                {isLoading === service.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Memanggil...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        Panggil Selanjutnya
                                                    </div>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Antrian Dipanggil */}
                                        <div>
                                            <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                                <UserCheck className="h-4 w-4" />
                                                Sedang Dipanggil ({called.length})
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {called.map((queue) => (
                                                    <div
                                                        key={queue.id}
                                                        className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="font-mono font-bold text-lg text-blue-700">
                                                                {queue.queue_code}
                                                            </div>
                                                            <Badge variant="default">
                                                                Dipanggil
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-gray-500 mb-3">
                                                            Dipanggil: {new Date(queue.created_at).toLocaleTimeString('id-ID')}
                                                        </div>
                                                        
                                                        <Button
                                                            onClick={() => handleCompleteQueue(queue.id)}
                                                            disabled={completingQueue === queue.id}
                                                            className="w-full bg-green-600 hover:bg-green-700"
                                                            size="sm"
                                                        >
                                                            {completingQueue === queue.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                    Menyelesaikan...
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Selesai
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Antrian Selesai */}
                                        <div>
                                            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4" />
                                                Selesai Hari Ini ({completed.length})
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {completed.slice(0, 5).map((queue) => (
                                                    <div
                                                        key={queue.id}
                                                        className="p-3 rounded-lg bg-green-50 border border-green-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-mono font-bold text-green-700">
                                                                {queue.queue_code}
                                                            </div>
                                                            <Badge variant="outline" className="text-green-700 border-green-300">
                                                                Selesai
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(queue.created_at).toLocaleTimeString('id-ID')}
                                                        </div>
                                                    </div>
                                                ))}
                                                {completed.length > 5 && (
                                                    <div className="text-center text-gray-500 text-sm">
                                                        +{completed.length - 5} lainnya
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {Object.keys(groupedQueues).length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Belum ada antrian hari ini
                                </h3>
                                <p className="text-gray-500">
                                    Antrian akan muncul di sini ketika ada pengunjung yang mengambil nomor
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
