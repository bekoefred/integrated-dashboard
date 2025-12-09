import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Activity, Plus, ArrowLeft } from 'lucide-react';
import Dashboard from '@components/components/SIPMonitor/Dashboard';
import AddTrunkModal from '@components/components/SIPMonitor/AddTrunkModal';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

const Navbar = dynamic(() => import('@components/components/Shared/Navbar'), {
    ssr: false,
});

interface Trunk {
    id: string;
    name: string;
    provider: string;
    ip: string;
    port: string;
    status?: string;
    calls?: number;
    latency?: string;
    timestamp?: string;
}

let socket: Socket;

export default function SIPMonitorPage() {
    const [trunks, setTrunks] = useState<Trunk[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrunk, setEditingTrunk] = useState<Trunk | null>(null);

    useEffect(() => {
        // Initialize socket connection
        socketInitializer();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const socketInitializer = async () => {
        // Use environment variable or fallback to current origin
        const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;

        // Connect to SIP monitor backend
        socket = io(SOCKET_URL);

        socket.on('initial_state', (data: Trunk[]) => {
            setTrunks(data);
        });

        socket.on('status_update', (update: any) => {
            setTrunks(prev => prev.map(t =>
                t.id === update.trunkId ? { ...t, ...update } : t
            ));
        });

        socket.on('trunk_added', (newTrunk: Trunk) => {
            setTrunks(prev => [...prev, newTrunk]);
        });

        socket.on('trunk_updated', (updatedTrunk: Trunk) => {
            setTrunks(prev => prev.map(t => t.id === updatedTrunk.id ? updatedTrunk : t));
        });

        socket.on('trunk_deleted', (trunkId: string) => {
            setTrunks(prev => prev.filter(t => t.id !== trunkId));
        });
    };

    const handleAddClick = () => {
        setEditingTrunk(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (trunk: Trunk) => {
        setEditingTrunk(trunk);
        setIsModalOpen(true);
    };

    return (
        <div className={inter.className}>
            <Head>
                <title>SIP Monitor | Mergdata Monitor</title>
            </Head>
            <Navbar />

            <div className="min-h-screen bg-slate-950 text-slate-200">
                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-950/80 border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Dashboard</span>
                            </Link>
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                SIP Trunk Monitor
                            </h1>
                        </div>
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Trunk</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Dashboard trunks={trunks} onEdit={handleEditClick} />
                </main>

                {/* Modal */}
                {isModalOpen && (
                    <AddTrunkModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        trunk={editingTrunk}
                    />
                )}
            </div>
        </div>
    );
}
