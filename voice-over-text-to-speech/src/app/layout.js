import { Geist, Geist_Mono } from "next/font/google";
import { Viewport } from 'next';
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
};

export const metadata = {
  metadataBase: new URL('https://voice-over-text-to-speech.vercel.app'),
  title: {
    default: 'Text to Speech Converter',
    template: '%s | Text to Speech Converter'
  },
  description: 'Convert text to speech with customizable voices, pitch, speed, and download capabilities. Free online text-to-speech converter with multiple language support.',
  keywords: [
    'text to speech',
    'speech synthesis',
    'voice converter',
    'audio generator',
    'text to audio',
    'speech generator',
    'voice synthesis',
    'text reader'
  ],
  authors: [
    { name: 'muzammil shah', url: 'https://muzammilshah.com' }
  ],
  creator: 'muzammil shah',
  publisher: 'Your Company Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voice-over-text-to-speech.vercel.app',
    title: 'Text to Speech Converter',
    description: 'Convert text to speech with customizable voices and download capabilities.',
    siteName: 'Text to Speech Converter',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Text to Speech Converter'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to Speech Converter',
    description: 'Convert text to speech with customizable voices and download capabilities.',
    creator: '@yourtwitter',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },

  alternates: {
    canonical: 'https://voice-over-text-to-speech.vercel.app',
    languages: {
      'en-US': 'https://voice-over-text-to-speech.vercel.app/en-US',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}