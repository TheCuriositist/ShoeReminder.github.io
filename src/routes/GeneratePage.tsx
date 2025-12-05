import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, AlertCircle } from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';
import { EVENT_CONFIG, buildICSContent, formatDateAllDay, getTargetDates, generateGoogleCalendarUrl } from '@/lib/calendar';
import { downloadFile } from '@/lib/utils';
import { useKeyDown } from '@/hooks/useKeyDown';
import { ReminderActions } from '@/components/ReminderActions';
import { z } from 'zod';

const MIN_MONTHS = 1;
const MAX_MONTHS = 24;
const DEFAULT_MONTHS = 6;

const monthsSchema = z.coerce.number().int().min(MIN_MONTHS).max(MAX_MONTHS);

export function GeneratePage() {
    const [searchParams] = useSearchParams();
    const monthsParam = searchParams.get('months') || searchParams.get('duration');

    const result = monthsSchema.safeParse(monthsParam);
    const months = result.success ? result.data : DEFAULT_MONTHS;
    const hasError = !result.success && monthsParam !== null;

    const { targetDate, endDate } = getTargetDates(months);
    const eventTitle = EVENT_CONFIG.title;

    const [showQR, setShowQR] = useState(false);

    const getICSData = () => {
        const startStr = formatDateAllDay(targetDate);
        const endStr = formatDateAllDay(endDate);
        return buildICSContent(startStr, endStr, eventTitle, EVENT_CONFIG.description, EVENT_CONFIG.location);
    };

    const handleDownloadICS = () => {
        const icsContent = getICSData();
        downloadFile(icsContent, `reminder-${months}-months.ics`, 'text/calendar;charset=utf-8');
    };

    useKeyDown('k', () => setShowQR(prev => !prev), { metaOrCtrl: true, preventDefault: true });


    useEffect(() => {
        const format = searchParams.get('format');
        if (format === 'ics') {
            handleDownloadICS();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const googleUrl = generateGoogleCalendarUrl(targetDate, endDate, eventTitle);

    if (hasError) {
        return (
            <Card className="w-[90%] max-w-[400px] shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Invalid Request</CardTitle>
                    <CardDescription className="text-gray-600">
                        Months must be between {MIN_MONTHS} and {MAX_MONTHS}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => window.location.href = '/api/v1/reminders?months=6'}
                    >
                        Use Default (6 months)
                    </Button>
                </CardContent>
            </Card>
        );
    }

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
