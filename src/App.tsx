import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShoeReminder } from './components/ShoeReminder';
import { GeneratePage } from './routes/GeneratePage';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShoeReminder />} />
          <Route path="/api/v1/reminders" element={<GeneratePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
