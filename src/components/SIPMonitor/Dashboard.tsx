import React from 'react';
import TrunkCard from './TrunkCard';
import { ServerCrash } from 'lucide-react';

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

interface DashboardProps {
    trunks: Trunk[];
    onEdit: (trunk: Trunk) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trunks, onEdit }) => {
    if (trunks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <ServerCrash className="w-12 h-12 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No Trunks Configured</h3>
                <p className="text-sm">Add a new SIP trunk to start monitoring.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trunks.map((trunk) => (
                <TrunkCard key={trunk.id} trunk={trunk} onEdit={onEdit} />
            ))}
        </div>
    );
};

export default Dashboard;
