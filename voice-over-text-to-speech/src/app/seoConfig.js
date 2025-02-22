export function getSEODetails() {
    return {
        title: "Text to Speech Converter | Generate & Download Audio Online",
        description: "Convert text to natural sounding speech and download as audio file. Multiple voices, adjustable pitch, speed, and volume settings.",
        keywords: "text to speech, TTS, audio generator, download speech, voice synthesis",
        openGraph: {
            type: 'website',
            url: 'https://voice-over-text-to-speech.vercel.app/',
            title: "Text to Speech Converter",
            description: "Instant text-to-speech conversion with audio download capabilities",
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Text to Speech Converter',
                }
            ]
        }
    };
}