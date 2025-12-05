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
            <Card className="w-[90%] max-w-[400px] shadow-2xl border-2 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Footprints className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">Get New Shoes</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Select a timeframe for your reminder.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <div className="space-y-2">
                        <label htmlFor="month-select" className="text-sm font-medium text-foreground ml-1">
                            Remind me in:
                        </label>
                        <Select value={monthsToAdd} onValueChange={setMonthsToAdd}>
                            <SelectTrigger id="month-select" className="w-full border-2 border-input shadow-2xl">
                                <SelectValue placeholder="Select months" />
                            </SelectTrigger>
                            <SelectContent className="shadow-2xl">
                                {[3, 4, 5, 6, 7, 8, 10, 12].map((month) => (
                                    <SelectItem key={month} value={month.toString()} className="focus:bg-primary focus:text-primary-foreground">
                                        {month} Months
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-primary/10 text-primary p-3 rounded-lg text-center font-bold text-lg border-primary border">
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
