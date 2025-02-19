'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    FaVolumeUp,
    FaMagic,
    FaDownload,
    FaStop,
    FaChevronDown
} from 'react-icons/fa';

const TextToSpeech = () => {
    // State management
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [audioSettings, setAudioSettings] = useState({
        pitch: 1,
        rate: 1,
        volume: 1
    });

    // Refs for audio handling
    const audioContextRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0]);
            }
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Initialize audio context
    const initializeAudioContext = async () => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await audioContextRef.current.resume();
    };

    // Handle recording start
    const startRecording = useCallback(async () => {
        await initializeAudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `speech-${Date.now()}.wav`;
            link.click();
            URL.revokeObjectURL(audioUrl);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
    }, []);

    // Handle speech synthesis
    const speak = useCallback(async (download = false) => {
        if (!text) return;

        if (download) {
            await startRecording();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.pitch = audioSettings.pitch;
        utterance.rate = audioSettings.rate;
        utterance.volume = audioSettings.volume;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (download && mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            if (download && mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [text, selectedVoice, audioSettings]);

    // Handle stop speaking
    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    }, []);

    // Handle audio setting changes
    const handleSettingChange = (setting, e) => {
        const value = parseFloat(e.target.value);
        setAudioSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 text-gray-500">
            <h2 className="text-2xl font-bold mb-6">Text to Speech with Audio Download</h2>

            <div className="space-y-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className='flex justify-end'><p>Character Count: {text.length}</p></div>
                <div className="space-y-4">
                    {/* Voice Selection Dropdown */}
                    <p>{voices.length} free voices available</p>
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium mb-2">Select Voice</label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-3 text-left border border-gray-300 rounded-lg flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span>{selectedVoice?.name || 'Select a voice'}</span>
                            <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {voices.map(voice => (
                                    <button
                                        key={voice.voiceURI}
                                        onClick={() => {
                                            setSelectedVoice(voice);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full p-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                    >
                                        {voice.name} ({voice.lang})
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Audio Settings */}
                    <div className="space-y-4">
                        {[
                            { name: 'pitch', icon: <FaMagic className="w-4 h-4" />, label: 'Pitch' },
                            { name: 'rate', icon: <FaVolumeUp className="w-4 h-4" />, label: 'Speed' },
                            { name: 'volume', icon: <FaVolumeUp className="w-4 h-4" />, label: 'Volume' }
                        ].map(setting => (
                            <div key={setting.name} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {setting.icon}
                                    <label className="text-sm font-medium">
                                        {setting.label} ({audioSettings[setting.name].toFixed(1)})
                                    </label>
                                </div>
                                <input
                                    type="range"
                                    value={audioSettings[setting.name]}
                                    min={setting.name === 'volume' ? 0 : 0.1}
                                    max={2}
                                    step={0.1}
                                    onChange={(e) => handleSettingChange(setting.name, e)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => speak(false)}
                            disabled={isSpeaking || !text}
                            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSpeaking ? 'Speaking...' : 'Play Speech'}
                        </button>
                        <button
                            onClick={() => speak(true)}
                            disabled={isSpeaking || !text}
                            className="flex-1 py-3 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <FaDownload className="w-4 h-4" />
                            Download Audio
                        </button>
                        <button
                            onClick={stop}
                            disabled={!isSpeaking}
                            className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <FaStop className="w-4 h-4" />
                            Stop
                        </button>
                    </div>
                </div>
            </div>
            <a className='' href="https://github.com/Muzammil803" target='_blank'><p className='pt-5'>Made with love by Muhammad Muzammil</p></a>
        </div>
    );
};

export default TextToSpeech;