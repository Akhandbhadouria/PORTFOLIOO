import { Geist } from 'next/font/google'
import './globals.css'
import TransitionProvider from '../components/PageTransition'

const SITE_URL = 'https://akhand.dev'
const CANONICAL_URL = 'https://akhand.dev/'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Akhand — Data Science & AI/ML Engineer',
  description: 'Portfolio of Akhand — Aspiring Data Scientist and AI/ML Engineer. Explore projects in Machine Learning, Data Science, Django, and Full-Stack development.',
  keywords: ['Akhand', 'Data Science', 'Machine Learning', 'AI Engineer', 'ML Engineer', 'Django', 'Python', 'Portfolio', 'LPU'],
  authors: [{ name: 'Akhand Pratapsingh', url: SITE_URL }],
  creator: 'Akhand Pratapsingh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: CANONICAL_URL,
    siteName: 'Akhand Portfolio',
    title: 'Akhand — Data Science & AI/ML Engineer',
    description: 'Portfolio of Akhand — Aspiring Data Scientist and AI/ML Engineer. Explore projects in Machine Learning, Data Science, Django, and Full-Stack development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akhand — Data Science & AI/ML Engineer',
    description: 'Portfolio of Akhand — Aspiring Data Scientist and AI/ML Engineer. Explore projects in Machine Learning, Data Science, Django, and Full-Stack development.',
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the head inline script sets data-intro on <html>
    // before hydration (theme-flash pattern), so its attributes intentionally
    // differ from the server HTML.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Decides the home-page intro curtain BEFORE first paint, so nothing
            flashes. Show it only on a fresh session-open or a hard refresh;
            skip it for in-session navigations back to "/", crawlers, and no-JS.
            Runs in <head> (synchronously, pre-body-paint); the result drives
            CSS (html[data-intro]) and is read by app/page.jsx via __vyIntro. */}
        {/* Theme decided BEFORE first paint (localStorage, else OS preference)
            so there is no light flash. ThemeSwitch reads/writes the same key. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vy_theme'),s='saved';if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';s='device';}document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-theme-source',s);}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.setAttribute('data-theme-source','device');}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var ua=navigator.userAgent||'';var bot=/bot|crawl|spider|slurp|mediapartners|lighthouse|headlesschrome|prerender|facebookexternalhit|embedly|quora|whatsapp|telegram|discord|slackbot|bingpreview|pinterest|applebot|yandex|baidu|duckduckbot/i.test(ua);var reload=false;try{var n=performance.getEntriesByType('navigation')[0];reload=n?n.type==='reload':(performance.navigation&&performance.navigation.type===1);}catch(e){}var seen=false;try{seen=sessionStorage.getItem('vy_intro_seen')==='1';sessionStorage.setItem('vy_intro_seen','1');}catch(e){}var show=!bot&&(reload||!seen);d.setAttribute('data-intro',show?'show':'skip');window.__vyIntro=show;}catch(e){window.__vyIntro=true;document.documentElement.setAttribute('data-intro','show');}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <div className="site-grid-bg" aria-hidden="true" />
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  )
}
