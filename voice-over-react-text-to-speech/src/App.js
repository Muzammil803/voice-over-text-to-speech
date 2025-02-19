import { useState, useEffect, useRef } from 'react';

const TextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        setSelectedVoice(voices[0]);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const initializeAudioContext = async () => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    await audioContextRef.current.resume();
  };

  const startRecording = async () => {
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
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `speech-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(audioUrl);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.start();
  };

  const speak = async (download = false) => {
    if (!text) return;

    if (download) {
      await startRecording();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

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
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="tts-container">
      <h2>Text to Speech with Audio Download</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        rows="6"
      />

      <div className="controls">
        <div className="voice-selection">
          <label>Select Voice:</label>
          <select
            value={selectedVoice?.voiceURI || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.voiceURI === e.target.value);
              setSelectedVoice(voice);
            }}
          >
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="sliders">
          <div className="range-control">
            <label>
              Pitch ({pitch.toFixed(1)})
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </label>
          </div>

          <div className="range-control">
            <label>
              Speed ({rate.toFixed(1)})
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </label>
          </div>

          <div className="range-control">
            <label>
              Volume ({volume.toFixed(1)})
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="buttons">
          <button
            onClick={() => speak(false)}
            disabled={isSpeaking || !text}
          >
            {isSpeaking ? 'Speaking...' : 'Play Speech'}
          </button>
          <button
            onClick={() => speak(true)}
            disabled={isSpeaking || !text}
          >
            Download Audio
          </button>
          <button onClick={stop} disabled={!isSpeaking}>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = `
  .tts-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  }

  textarea {
    width: 100%;
    margin: 1rem 0;
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    min-height: 150px;
    resize: vertical;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .voice-selection select {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
  }

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .range-control {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #ddd;
  }

  .range-control label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 500;
  }

  .range-control input[type="range"] {
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 4px;
    outline: none;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background: #007bff;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TextToSpeech;