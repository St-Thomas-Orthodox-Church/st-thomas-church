import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import {PublicNav}  from '@/components/ui/nav';
import Footer from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'St Thomas Church',
  description: 'St Thomas Orthodox Church.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
        >
        <body className="min-h-[100dvh] bg-gray-50">
        <PublicNav/>
        <main>
            <section className={'content'}>
                <SWRConfig
                    value={{
                        fallback: {
                            // We do NOT await here
                            // Only components that read this data will suspend
                            '/api/user': 'Yulia',
                            '/api/team': 'Dev'
                        }
                    }}
                >
                    {children}
                </SWRConfig>
            </section>
        </main>
        <Footer/>
        </body>
        </html>
    );
}
