// app/page.js
import TextToSpeechClient from '../components/TextToSpeech';
import { getSEODetails } from './seoConfig';

export async function generateMetadata() {
  return getSEODetails();
}

export default function TextToSpeechPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <TextToSpeechClient />
        <ServerFooter />
      </div>
    </main>
  );
}

function ServerFooter() {
  return (
    <p className="mt-8 text-center text-gray-600">
      Made with ❤️ by <a href="https://github.com/Muzammil803"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline">
        Muhammad Muzammil
      </a>
    </p>
  );
}