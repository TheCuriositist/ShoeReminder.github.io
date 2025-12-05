export const EVENT_CONFIG = {
    title: "Get New Shoes",
    description: "Time to replace your running shoes.\n\nStore Phone: (301) 881-0021\nStore Hours: \nMon-Sat: 10am - 6pm\nSun: 12pm - 4pm",
    location: "11910 Parklawn Dr R, Rockville, MD 20852",
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
