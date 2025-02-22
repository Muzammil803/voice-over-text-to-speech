// app/ControlButtons.js
'use client';
import { FaDownload, FaStop } from 'react-icons/fa';

const ControlButtons = ({ isSpeaking, onSpeak, onStop, hasText }) => {
    return (
        <div className="mt-6 flex gap-4">
            <button
                onClick={() => onSpeak(false)}
                disabled={isSpeaking || !hasText}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                aria-label={isSpeaking ? 'Currently speaking' : 'Play speech'}
            >
                {isSpeaking ? 'Speaking...' : 'Play Speech'}
            </button>

            <button
                onClick={() => onSpeak(true)}
                disabled={isSpeaking || !hasText}
                className="flex-1 py-3 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
                aria-label="Download audio"
            >
                <FaDownload className="w-4 h-4" />
                Download
            </button>

            <button
                onClick={onStop}
                disabled={!isSpeaking}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                aria-label="Stop speaking"
            >
                <FaStop className="w-4 h-4" />
                Stop
            </button>
        </div>
    );
};

export default ControlButtons;