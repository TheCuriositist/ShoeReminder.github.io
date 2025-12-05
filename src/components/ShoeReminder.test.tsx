import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ShoeReminder } from './ShoeReminder';

window.scrollTo = vi.fn();

if (typeof window.URL.createObjectURL === 'undefined') {
    Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn(() => 'mock-url') });
} else {
    window.URL.createObjectURL = vi.fn(() => 'mock-url');
}
window.URL.revokeObjectURL = vi.fn();

vi.mock('./QRCodeModal', () => ({
    QRCodeModal: ({ isOpen, title, value }: { isOpen: boolean; title: string; value: string }) => (
        isOpen ? <div data-testid="qr-modal">{title} - {value}</div> : null
    )
}));

vi.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, children }: { onValueChange: (v: string) => void; children: ReactNode }) => (
        <div data-testid="select">
            <button onClick={() => onValueChange('3')}>Select 3 Months</button>
            {children}
        </div>
    ),
    SelectTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SelectValue: () => <div>Select Value</div>,
    SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SelectItem: ({ value, children }: { value: string; children: ReactNode }) => <div data-value={value}>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    CardTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    CardDescription: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('ShoeReminder Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({
            toFake: ['Date']
        });
        vi.setSystemTime(new Date(2023, 0, 1));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly', () => {
        render(<ShoeReminder />);
        expect(screen.getByText('Get New Shoes')).toBeInTheDocument();
        // Check date display - 6 months from Jan 1 is July 1
        expect(screen.getByText(/July 1, 2023/)).toBeInTheDocument();
    });

    it('updates date when month selection changes', async () => {
        render(<ShoeReminder />);

        // Use our mock button to change value
        fireEvent.click(screen.getByText('Select 3 Months'));

        // 3 months from Jan 1 is April 1
        expect(await screen.findByText(/April 1, 2023/)).toBeInTheDocument();
    });

    it('generates correct Google Calendar link', () => {
        render(<ShoeReminder />);
        const googleLink = screen.getByRole('link', { name: /Google Calendar/i });
        const href = googleLink.getAttribute('href');
        expect(href).toContain('calendar.google.com');
        expect(href).toContain('text=6+Month+Get+New+Shoes');
    });

    it('handles download ICS button click', () => {
        render(<ShoeReminder />);
        const downloadBtn = screen.getByRole('button', { name: /Apple \/ Outlook \/ Mobile/i });
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
        fireEvent.click(downloadBtn);
        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
    });

    it('opens QR code modal on keyboard shortcut', async () => {
        render(<ShoeReminder />);

        expect(screen.queryByTestId('qr-modal')).not.toBeInTheDocument();

        // Press Cmd+K
        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        await waitFor(() => {
            expect(screen.getByTestId('qr-modal')).toBeInTheDocument();
        });

        expect(screen.getByTestId('qr-modal')).toHaveTextContent('Scan for Reminder');
    });
});
