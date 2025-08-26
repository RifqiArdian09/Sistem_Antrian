import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Volume2, Clock } from 'lucide-react';

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

export default function DisplayIndex({ queues }: Props) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentQueue, setCurrentQueue] = useState<Queue | null>(null);

    // Update waktu setiap detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Ambil antrian yang sedang dipanggil
    useEffect(() => {
        const calledQueue = queues.find(q => q.status === 'called');
        setCurrentQueue(calledQueue || null);
    }, [queues]);

    // Fungsi untuk memutar suara notifikasi
    const playNotification = (queueCode: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
                `Nomor antrian ${queueCode.split('').join(' ')}, silakan menuju ke loket yang tersedia`
            );
            utterance.lang = 'id-ID';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    };

    // Auto play notification ketika ada antrian baru dipanggil
    useEffect(() => {
        if (currentQueue) {
            playNotification(currentQueue.queue_code);
        }
    }, [currentQueue]);

    // Ambil antrian menunggu per layanan
    const getWaitingQueues = () => {
        return queues.filter(q => q.status === 'waiting')
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    };

    // Group antrian menunggu berdasarkan layanan
    const groupedQueues = getWaitingQueues().reduce((acc, queue) => {
        const serviceId = queue.service_id;
        if (!acc[serviceId]) {
            acc[serviceId] = {
                service: queue.service,
                queues: []
            };
        }
        acc[serviceId].queues.push(queue);
        return acc;
    }, {} as Record<number, { service: Service; queues: Queue[] }>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <Head title="Display Antrian" />
            
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Monitor className="h-8 w-8 text-blue-400" />
                            <h1 className="text-2xl font-bold">Display Antrian Digital</h1>
                        </div>
                        <div className="flex items-center gap-4 text-lg">
                            <Clock className="h-5 w-5" />
                            <span className="font-mono">
                                {currentTime.toLocaleTimeString('id-ID')}
                            </span>
                            <span className="text-blue-300">
                                {currentTime.toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Nomor yang Sedang Dipanggil */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                                <Volume2 className="h-8 w-8 animate-pulse" />
                                NOMOR YANG DIPANGGIL
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            {currentQueue ? (
                                <div className="space-y-4">
                                    <div className="text-8xl font-mono font-bold tracking-wider animate-pulse">
                                        {currentQueue.queue_code}
                                    </div>
                                    <div className="text-2xl">
                                        Layanan: <span className="font-semibold">{currentQueue.service.name}</span>
                                    </div>
                                    <div className="text-lg text-red-100">
                                        Silakan menuju ke loket yang tersedia
                                    </div>
                                </div>
                            ) : (
                                <div className="text-4xl text-red-200">
                                    Tidak ada antrian yang dipanggil
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Daftar Antrian Menunggu */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {Object.values(groupedQueues).map(({ service, queues }) => (
                        <Card key={service.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-300">
                                    {service.name} ({service.prefix})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-300 mb-4">
                                        Antrian Menunggu: {queues.length}
                                    </div>
                                    
                                    {queues.slice(0, 8).map((queue, index) => (
                                        <div
                                            key={queue.id}
                                            className={`flex items-center justify-between p-3 rounded-lg ${
                                                index === 0 
                                                    ? 'bg-yellow-500/20 border border-yellow-400/30' 
                                                    : 'bg-white/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`font-mono text-lg font-bold ${
                                                    index === 0 ? 'text-yellow-300' : 'text-blue-300'
                                                }`}>
                                                    {queue.queue_code}
                                                </div>
                                                {index === 0 && (
                                                    <Badge className="bg-yellow-500 text-black">
                                                        Selanjutnya
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {new Date(queue.created_at).toLocaleTimeString('id-ID')}
                                            </div>
                                        </div>
                                    ))}

                                    {queues.length > 8 && (
                                        <div className="text-center text-gray-400 text-sm">
                                            +{queues.length - 8} antrian lainnya
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {Object.keys(groupedQueues).length === 0 && (
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="text-center py-12">
                            <div className="text-2xl text-gray-300">
                                Tidak ada antrian menunggu
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Auto refresh setiap 5 detik */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    setInterval(() => {
                        window.location.reload();
                    }, 5000);
                `
            }} />
        </div>
    );
}
