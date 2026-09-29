import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | ContentForge AI',
        default: 'ContentForge AI'
    },
    description: 'A generative content workflow for turning one campaign idea into multi-platform content.'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased text-white bg-slate-950">
                <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%)] px-5 sm:px-8">
                    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
                        <Header />
                        <main className="grow">{children}</main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
