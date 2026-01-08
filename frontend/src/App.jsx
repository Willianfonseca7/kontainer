import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Containers from './pages/Containers';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
    </AppShell>
  );
}
