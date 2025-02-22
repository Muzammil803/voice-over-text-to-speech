// app/TextToSpeechClient.js
'use client';
import { useState, useRef, useCallback } from 'react';
import VoiceDropdown from './VoiceDropdown';
import AudioSettings from './AudioSettings';
import ControlButtons from './ControlButtons';
import CharacterCount from './CharacterCount';

const TextToSpeechClient = () => {
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [audioSettings, setAudioSettings] = useState({
        pitch: 1,
        rate: 1,
        volume: 1
    });

    const audioContextRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const initializeAudioContext = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            await audioContextRef.current.resume();
        }
    }, []);

    const startRecording = useCallback(async () => {
        await initializeAudioContext();
        try {
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
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }, [initializeAudioContext]);

    const speak = useCallback(async (download = false) => {
        if (!text || !selectedVoice) return;

        if (download) {
            await startRecording();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        Object.entries(audioSettings).forEach(([key, value]) => {
            utterance[key] = value;
        });

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
    }, [text, selectedVoice, audioSettings, startRecording]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 text-gray-500">
            <h1 className="text-2xl font-bold mb-6">Text to Speech with Audio Download</h1>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <CharacterCount text={text} />
            <VoiceDropdown onVoiceSelect={setSelectedVoice} />
            <AudioSettings settings={audioSettings} onSettingChange={setAudioSettings} />
            <ControlButtons
                isSpeaking={isSpeaking}
                onSpeak={speak}
                onStop={stop}
                hasText={!!text}
            />
        </div>
    );
};

export default TextToSpeechClient;