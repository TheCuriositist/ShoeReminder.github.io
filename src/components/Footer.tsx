import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full py-4 mt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">

                <a
                    href="https://github.com/TheCuriositist/ShoeReminder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    <span>Made with</span>
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </a>
            </div>
        </footer>
    );
}
