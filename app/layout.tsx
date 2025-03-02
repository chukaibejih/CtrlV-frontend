import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { GoogleAnalytics } from '@next/third-parties/google';

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
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <footer className="py-6 px-8 bg-zinc-900/80 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-zinc-400 text-sm">
                © {new Date().getFullYear()} CtrlV - Code sharing at the speed of paste
              </p>
            </div>
          </div>
        </footer>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}