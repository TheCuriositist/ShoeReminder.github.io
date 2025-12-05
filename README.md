# Shoe Reminder

A modern web application to help you schedule reminders for replacing your running shoes.

## Features

- **Flexible Duration**: Generate reminders from 1 to 24 months
- **Universal Calendar Support**: Download ICS files or add directly to Google Calendar
- **API Endpoint**: Access reminders via `/api/v1/reminders?months=6`
- **QR Code Sharing**: Press `Cmd/Ctrl + K` to generate a QR code
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- React 19 + Vite (Rolldown)
- TypeScript
- Tailwind CSS v4
- ShadCN UI
- Zod validation
- Bun

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## API Usage

```
GET /api/v1/reminders?months=6
GET /api/v1/reminders?months=6&format=ics  # Auto-download
```

Parameters:
- `months` or `duration`: Number of months (1-24)
- `format`: Optional. Set to `ics` for auto-download

## License

MIT
