import { describe, it, expect, vi } from 'vitest';
import {
    buildICSContent,
    formatDateAllDay,
    getTargetDates,
    generateGoogleCalendarUrl,
    EVENT_CONFIG
} from './calendar';

describe('calendar utilities', () => {
    describe('formatDateAllDay', () => {
        it('formats date correctly as YYYYMMDD', () => {
            const date = new Date(2023, 9, 25); // Month is 0-indexed, so 9 is October
            expect(formatDateAllDay(date)).toBe('20231025');
        });

        it('handles single digit months and days', () => {
            const date = new Date(2023, 0, 5); // January 5th
            expect(formatDateAllDay(date)).toBe('20230105');
        });
    });

    describe('getTargetDates', () => {
        it('calculates target date correctly adding months', () => {
            const now = new Date(2023, 0, 15);
            vi.setSystemTime(now);

            const { targetDate, endDate } = getTargetDates(6);

            // Expected: July 15, 2023
            expect(targetDate.getFullYear()).toBe(2023);
            expect(targetDate.getMonth()).toBe(6); // July
            expect(targetDate.getDate()).toBe(15);

            // End date should be one day after target date
            expect(endDate.getDate()).toBe(16);

            vi.useRealTimers();
        });
    });

    describe('buildICSContent', () => {
        it('generates valid ICS content structure', () => {
            const content = buildICSContent(
                '20231025',
                '20231026',
                'Test Event',
                'Test Description',
                'Test Location'
            );

            expect(content).toContain('BEGIN:VCALENDAR');
            expect(content).toContain('VERSION:2.0');
            expect(content).toContain('SUMMARY:Test Event');
            expect(content).toContain('DESCRIPTION:Test Description');
            expect(content).toContain('LOCATION:Test Location');
            expect(content).toContain('END:VCALENDAR');
        });
    });

    describe('generateGoogleCalendarUrl', () => {
        it('generates correct google calendar URL', () => {
            const targetDate = new Date(2023, 9, 25);
            const endDate = new Date(2023, 9, 26);
            const title = "New Shoes";

            const urlString = generateGoogleCalendarUrl(targetDate, endDate, title);
            const url = new URL(urlString);

            expect(url.origin).toBe('https://calendar.google.com');
            expect(url.searchParams.get('action')).toBe('TEMPLATE');
            expect(url.searchParams.get('text')).toBe(title);
            expect(url.searchParams.get('details')).toBe(EVENT_CONFIG.description);
            expect(url.searchParams.get('dates')).toBe('20231025/20231026');
        });
    });
});
