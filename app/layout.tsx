import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Load Inter for UI text
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Load Fira Code for code blocks
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const metadata: Metadata = {
  title: 'CtrlV - Code sharing at the speed of paste',
  description: 'Share code snippets instantly with syntax highlighting and zero friction',
  keywords: 'code sharing, paste, developer tools, code snippets, syntax highlighting',
  authors: [{ name: 'Chukwuka Ibejih'}],
  openGraph: {
    title: 'CtrlV - Code sharing at the speed of paste',
    description: 'Share code snippets instantly with syntax highlighting and zero friction',
    type: 'website',
    locale: 'en_US',
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'CtrlV - Code sharing at the speed of paste',
  //   description: 'Share code snippets instantly with syntax highlighting and zero friction',
  // },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics code will be injected by Next.js */}
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {children}
        <Toaster />
        {/* Footer */}
        <footer className="py-6 px-8 bg-zinc-900/80 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-zinc-400 text-sm">
                © {new Date().getFullYear()} CtrlV - Code sharing at the speed of paste
              </p>
            </div>
            {/* <div className="flex gap-6">
              <a href="/about" className="text-zinc-400 hover:text-emerald-400 text-sm transition">
                About
              </a>
              <a href="/api-docs" className="text-zinc-400 hover:text-emerald-400 text-sm transition">
                API
              </a>
              <a href="/privacy" className="text-zinc-400 hover:text-emerald-400 text-sm transition">
                Privacy
              </a>
              <a href="https://github.com/yourusername/ctrlv" target="_blank" rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-emerald-400 text-sm transition">
                GitHub
              </a>
            </div> */}
          </div>
        </footer>
      </body>
    </html>
  );
}