import { Button } from "@/components/ui/button";
import { Calendar, Smartphone } from 'lucide-react';

interface ReminderActionsProps {
    onDownload: () => void;
    googleUrl: string;
}

export function ReminderActions({ onDownload, googleUrl }: ReminderActionsProps) {
    return (
        <div className="space-y-3">
            <Button
                variant="default"
                className="inline-flex items-center justify-center gap-2 whitespace-normal text-center rounded-md text-sm transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:brightness-90 font-semibold w-full py-6 h-auto"
                onClick={onDownload}
            >
                <Smartphone className="mr-2 h-5 w-5" />
                Apple / Outlook / Mobile
            </Button>

            <Button
                variant="secondary"
                className="inline-flex items-center justify-center gap-2 whitespace-normal text-center rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-full py-6 h-auto"
                asChild
            >
                <a href={googleUrl} target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-5 w-5" />
                    Add to Google Calendar
                </a>
            </Button>
        </div>
    );
}
