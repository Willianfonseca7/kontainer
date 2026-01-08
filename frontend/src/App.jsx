import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Containers from './pages/Containers';
import About from './pages/About';
import Contact from './pages/Contact';
import ContainerDetail from './pages/ContainerDetail';
import Login from './pages/Login';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/containers/:id" element={<ContainerDetail />} />
      </Routes>
    </AppShell>
  );
}
