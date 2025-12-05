import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">

                <a
                    href="https://github.com/TheCuriositist/ShoeReminder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    <span>Made with</span>
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </a>
            </div>
        </footer>
    );
}
