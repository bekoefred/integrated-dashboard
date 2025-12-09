import React from 'react';
import { Server, Activity, Clock, Edit2, Trash2 } from 'lucide-react';

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

interface TrunkCardProps {
    trunk: Trunk;
    onEdit: (trunk: Trunk) => void;
}

const TrunkCard: React.FC<TrunkCardProps> = ({ trunk, onEdit }) => {
    const isUp = trunk.status === 'Up';
    const isDown = trunk.status === 'Down';
    const isLag = trunk.status === 'Lag';

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this trunk?')) {
            try {
                await fetch(`http://localhost:3001/api/trunks/${trunk.id}`, {
                    method: 'DELETE',
                });
            } catch (err) {
                console.error('Failed to delete trunk', err);
            }
        }
    };

    return (
        <div className="group relative bg-slate-800 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
            {/* Status Indicator Line */}
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${isUp ? 'bg-emerald-500' : isDown ? 'bg-red-500' : 'bg-amber-500'
                }`} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isUp ? 'bg-emerald-500/10 text-emerald-500' :
                            isDown ? 'bg-red-500/10 text-red-500' :
                                'bg-amber-500/10 text-amber-500'
                        }`}>
                        <Server className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-500 transition-colors">
                            {trunk.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                                {trunk.provider}
                            </span>
                            <span>{trunk.ip}:{trunk.port}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(trunk)}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Activity className="w-3 h-3" />
                        <span>Active Calls</span>
                    </div>
                    <div className="text-xl font-mono font-medium text-white">
                        {trunk.calls || 0}
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Clock className="w-3 h-3" />
                        <span>Latency</span>
                    </div>
                    <div className={`text-xl font-mono font-medium ${parseInt(trunk.latency || '0') > 150 ? 'text-amber-500' : 'text-white'
                        }`}>
                        {trunk.latency || '0ms'}
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isUp ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        isDown ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500 animate-pulse' :
                            isDown ? 'bg-red-500' :
                                'bg-amber-500 animate-pulse'
                        }`} />
                    {trunk.status || 'Unknown'}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    Last update: {trunk.timestamp ? new Date(trunk.timestamp).toLocaleTimeString() : '--:--:--'}
                </div>
            </div>
        </div>
    );
};

export default TrunkCard;
