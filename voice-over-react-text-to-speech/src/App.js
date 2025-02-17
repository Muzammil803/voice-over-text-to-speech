import logo from './logo.svg';
import './App.css';
import Say from 'react-say';
import { useCallback } from 'react';
const TextToSpeech = () => {
  const selector = useCallback(voices => [...voices].find(v => v.lang === 'zh-HK'), []);

  return (
    <Say
      speak="A quick brown fox jumped over the lazy dogs."
      voice={selector}
    />
  );
}
function App() {
  return (
    <div className="App">
      <TextToSpeech />
    </div>
  );
}

export default App;
