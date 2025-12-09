import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Trunk {
    id?: string;
    name: string;
    provider: string;
    ip: string;
    port: string;
}

interface AddTrunkModalProps {
    isOpen: boolean;
    onClose: () => void;
    trunk?: Trunk | null;
}

const AddTrunkModal: React.FC<AddTrunkModalProps> = ({ isOpen, onClose, trunk }) => {
    const [formData, setFormData] = useState({
        name: '',
        provider: '',
        ip: '',
        port: '5060'
    });

    useEffect(() => {
        if (trunk) {
            setFormData({
                name: trunk.name,
                provider: trunk.provider,
                ip: trunk.ip,
                port: trunk.port
            });
        } else {
            setFormData({
                name: '',
                provider: '',
                ip: '',
                port: '5060'
            });
        }
    }, [trunk]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        // Use environment variable or fallback to current origin
        const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
        const url = trunk
            ? `${API_URL}/api/trunks/${trunk.id}`
            : `${API_URL}/api/trunks`;

        const method = trunk ? 'PUT' : 'POST';
        console.log('Making request to:', url, 'with method:', method);

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', res.status);

            if (res.ok) {
                console.log('Trunk saved successfully');
                onClose();
            } else {
                const errorData = await res.json();
                console.error('Server error:', errorData);
                alert(`Failed to save trunk: ${errorData.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error saving trunk:', err);
            alert(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-semibold text-white">
                        {trunk ? 'Edit Trunk' : 'Add New Trunk'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Trunk Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Twilio US East"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Provider</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Twilio"
                            value={formData.provider}
                            onChange={e => setFormData({ ...formData, provider: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">IP Address</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="1.2.3.4"
                                value={formData.ip}
                                onChange={e => setFormData({ ...formData, ip: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Port</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="5060"
                                value={formData.port}
                                onChange={e => setFormData({ ...formData, port: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
                        >
                            {trunk ? 'Save Changes' : 'Add Trunk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTrunkModal;
