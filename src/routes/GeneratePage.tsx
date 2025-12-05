import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Calendar, Smartphone } from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';
import { EVENT_CONFIG, buildICSContent, formatDateAllDay, getTargetDates, generateGoogleCalendarUrl } from '@/lib/calendar';

export function GeneratePage() {
    const [searchParams] = useSearchParams();
    const durationMonths = parseInt(searchParams.get('duration-months') || "6");
    const months = isNaN(durationMonths) ? 6 : durationMonths;
    const { targetDate, endDate } = getTargetDates(months);
    const dynamicTitle = `${months} Month ${EVENT_CONFIG.title}`;

    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setShowQR(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleDownloadICS = () => {
        const icsContent = getICSData();

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reminder-${months}-months.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getICSData = () => {
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);
        return buildICSContent(startStr, endStr, dynamicTitle, EVENT_CONFIG.description, EVENT_CONFIG.location);
    };

    const googleUrl = generateGoogleCalendarUrl(targetDate, endDate, dynamicTitle);

    return (
        <>
            <Card className="w-[90%] max-w-[400px] shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Footprints className="h-12 w-12 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Reminder Ready</CardTitle>
                    <CardDescription className="text-gray-600">
                        Here is your {months} month reminder link.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-indigo-50 text-indigo-700 p-3 rounded-lg text-center font-bold text-lg">
                        {targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6"
                            onClick={handleDownloadICS}
                        >
                            <Smartphone className="mr-2 h-5 w-5" />
                            Apple / Outlook / Mobile
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 py-6"
                            asChild
                        >
                            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
                                <Calendar className="mr-2 h-5 w-5" />
                                Add to Google Calendar
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <QRCodeModal
                isOpen={showQR}
                onClose={() => setShowQR(false)}
                value={getICSData()}
                title="Scan for Reminder"
            />
        </>
    );
}
