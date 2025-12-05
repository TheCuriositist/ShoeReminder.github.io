import { EVENT_TITLE, EVENT_DESCRIPTION, EVENT_LOCATION } from '@/config/branding';

export const EVENT_CONFIG = {
    title: EVENT_TITLE,
    description: EVENT_DESCRIPTION,
    location: EVENT_LOCATION,
};



export function buildICSContent(startStr: string, endStr: string, title: string, description: string, location: string) {
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

export function formatDateAllDay(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

export function getTargetDates(monthsToAdd: number) {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, now.getDate());
    const endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() + 1);

    return { targetDate, endDate };
}

export function generateGoogleCalendarUrl(targetDate: Date, endDate: Date, title: string) {
    const startStr = formatDateAllDay(targetDate);
    const endStr = formatDateAllDay(endDate);

    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', title);
    googleUrl.searchParams.append('details', EVENT_CONFIG.description);
    googleUrl.searchParams.append('location', EVENT_CONFIG.location);
    googleUrl.searchParams.append('dates', `${startStr}/${endStr}`);

    return googleUrl.toString();
}
