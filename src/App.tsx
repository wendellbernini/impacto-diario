import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminApp from './components/AdminApp';
import NewsPage from './components/NewsPage';
import BrasilPage from './components/BrasilPage';
import MundoPage from './components/MundoPage';
import PoliticaPage from './components/PoliticaPage';
import EconomiaPage from './components/EconomiaPage';
import SegurancaPage from './components/SegurancaPage';
import EducacaoPage from './components/EducacaoPage';
import CienciaPage from './components/CienciaPage';
import SaudePage from './components/SaudePage';
import UltimasPage from './components/UltimasPage';
import SearchPage from './components/SearchPage';
import HighlightsPage from './components/HighlightsPage';
import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/noticia/:slug" element={<NewsPage />} />
        <Route path="/brasil" element={<BrasilPage />} />
        <Route path="/mundo" element={<MundoPage />} />
        <Route path="/politica" element={<PoliticaPage />} />
        <Route path="/economia" element={<EconomiaPage />} />
        <Route path="/seguranca" element={<SegurancaPage />} />
        <Route path="/educacao" element={<EducacaoPage />} />
        <Route path="/ciencia" element={<CienciaPage />} />
        <Route path="/saude" element={<SaudePage />} />
        <Route path="/ultimas" element={<UltimasPage />} />
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/destaque" element={<HighlightsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function ScrollToTop() {
  useScrollToTop();
  return null;
}

export default App;