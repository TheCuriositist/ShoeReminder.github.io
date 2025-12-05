import { useState } from 'react';
import { QRCodeModal } from './QRCodeModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Footprints } from 'lucide-react';
import { EVENT_CONFIG, buildICSContent, formatDateAllDay, getTargetDates, generateGoogleCalendarUrl } from '@/lib/calendar';
import { downloadFile } from '@/lib/utils';
import { useKeyDown } from '@/hooks/useKeyDown';
import { ReminderActions } from './ReminderActions';

export function ShoeReminder() {
    const [monthsToAdd, setMonthsToAdd] = useState<string>("6");
    const [showQR, setShowQR] = useState(false);

    const months = parseInt(monthsToAdd);
    const { targetDate, endDate } = getTargetDates(months);
    const eventTitle = EVENT_CONFIG.title;

    const getICSData = () => {
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);
        return buildICSContent(startStr, endStr, eventTitle, EVENT_CONFIG.description, EVENT_CONFIG.location);
    };

    const handleDownloadICS = () => {
        const icsContent = getICSData();
        downloadFile(icsContent, `reminder-${months}-months.ics`, 'text/calendar;charset=utf-8');
    };

    const googleUrl = generateGoogleCalendarUrl(targetDate, endDate, eventTitle);

    useKeyDown('k', () => setShowQR(prev => !prev), { metaOrCtrl: true, preventDefault: true });


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
                                {[3, 4, 5, 6, 7, 8, 10, 12].map((month) => (
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

                    <ReminderActions onDownload={handleDownloadICS} googleUrl={googleUrl} />
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
