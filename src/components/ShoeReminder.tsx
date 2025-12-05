import { useState, useEffect } from 'react';
import { QRCodeModal } from './QRCodeModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Footprints, Calendar, Smartphone } from 'lucide-react';

const EVENT_CONFIG = {
    title: "Get New Shoes",
    description: "Time to replace your running shoes.\n\nStore Phone: (301) 881-0021\nStore Hours: \nMon-Sat: 10am - 6pm\nSun: 12pm - 4pm",
    location: "11910 Parklawn Dr R, Rockville, MD 20852",
};

function buildICSContent(startStr: string, endStr: string, title: string, description: string, location: string) {
    const uid = `${Date.now()}@shoereminder`;
    const dtstamp = new Date().toISOString().replace(/-|:|\.\d+/g, "");

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ShoeReminder//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${startStr}`,
        `DTEND;VALUE=DATE:${endStr}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
}

export function ShoeReminder() {
    const [monthsToAdd, setMonthsToAdd] = useState<string>("6");

    const months = parseInt(monthsToAdd);
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
    const endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() + 1);

    const formatDateAllDay = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const handleDownloadICS = () => {
        const months = parseInt(monthsToAdd);
        const dynamicTitle = `${months} Month ${EVENT_CONFIG.title}`;
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);
        const icsContent = buildICSContent(startStr, endStr, dynamicTitle, EVENT_CONFIG.description, EVENT_CONFIG.location);

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reminder-${months}-months.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getGoogleCalendarUrl = () => {
        const months = parseInt(monthsToAdd);
        const dynamicTitle = `${months} Month ${EVENT_CONFIG.title}`;
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);

        const googleUrl = new URL('https://calendar.google.com/calendar/render');
        googleUrl.searchParams.append('action', 'TEMPLATE');
        googleUrl.searchParams.append('text', dynamicTitle);
        googleUrl.searchParams.append('details', EVENT_CONFIG.description);
        googleUrl.searchParams.append('location', EVENT_CONFIG.location);
        googleUrl.searchParams.append('dates', `${startStr}/${endStr}`);

        return googleUrl.toString();
    };

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

    const getICSData = () => {
        const months = parseInt(monthsToAdd);
        const dynamicTitle = `${months} Month ${EVENT_CONFIG.title}`;
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);
        return buildICSContent(startStr, endStr, dynamicTitle, EVENT_CONFIG.description, EVENT_CONFIG.location);
    }

    return (
        <>
            <Card className="w-[90%] max-w-[400px] shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Footprints className="h-12 w-12 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Get New Shoes</CardTitle>
                    <CardDescription className="text-gray-600">
                        Select a timeframe for your reminder.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="month-select" className="text-sm font-medium text-gray-700 ml-1">
                            Remind me in:
                        </label>
                        <Select value={monthsToAdd} onValueChange={setMonthsToAdd}>
                            <SelectTrigger id="month-select" className="w-full bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select months" />
                            </SelectTrigger>
                            <SelectContent>
                                {[3, 4, 5, 6, 7, 8].map((month) => (
                                    <SelectItem key={month} value={month.toString()}>
                                        {month} Months
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                            <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                                <Calendar className="mr-2 h-5 w-5" />
                                Google Calendar
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
