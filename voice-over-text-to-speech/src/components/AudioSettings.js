// app/AudioSettings.js
'use client';
import { FaVolumeUp, FaMagic } from 'react-icons/fa';

const AudioSettings = ({ settings, onSettingChange }) => {
    const handleChange = (setting) => (e) => {
        onSettingChange(prev => ({
            ...prev,
            [setting]: parseFloat(e.target.value)
        }));
    };

    return (
        <div className="mt-6 space-y-4">
            {[
                { id: 'pitch', icon: <FaMagic />, label: 'Pitch' },
                { id: 'rate', icon: <FaVolumeUp />, label: 'Speed' },
                { id: 'volume', icon: <FaVolumeUp />, label: 'Volume' }
            ].map(({ id, icon, label }) => (
                <div key={id} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {icon}
                        <span>{label} ({settings[id].toFixed(1)})</span>
                    </div>
                    <input
                        type="range"
                        min={id === 'volume' ? 0 : 0.1}
                        max="2"
                        step="0.1"
                        value={settings[id]}
                        onChange={handleChange(id)}
                        className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500"
                        aria-label={`${label} control`}
                    />
                </div>
            ))}
        </div>
    );
};

export default AudioSettings;