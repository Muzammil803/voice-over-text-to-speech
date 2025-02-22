// app/VoiceDropdown.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const VoiceDropdown = ({ onVoiceSelect }) => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                const initialVoice = availableVoices[0];
                setSelectedVoice(initialVoice);
                onVoiceSelect(initialVoice);
            }
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [onVoiceSelect, selectedVoice]);

    const handleVoiceSelect = (voice) => {
        setSelectedVoice(voice);
        onVoiceSelect(voice);
        setIsOpen(false);
    };

    return (
        <div className="relative mt-4" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-2">Select Voice</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 text-left border border-gray-300 rounded-lg flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedVoice?.name || 'Select a voice'}</span>
                <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                    {voices.map(voice => (
                        <button
                            key={voice.voiceURI}
                            onClick={() => handleVoiceSelect(voice)}
                            role="option"
                            aria-selected={voice === selectedVoice}
                            className="w-full p-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        >
                            {voice.name} ({voice.lang})
                        </button>
                    ))}
                </div>
            )}
            <p className="mt-1 text-sm text-gray-500">{voices.length} voices available</p>
        </div>
    );
};

export default VoiceDropdown;