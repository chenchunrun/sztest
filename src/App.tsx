import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import SchoolDetail from '@/pages/SchoolDetail';
import SportsCalculator from '@/pages/SportsCalculator';
import ComparePage from '@/pages/ComparePage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/school/:id" element={<SchoolDetail />} />
      <Route path="/sports-calculator" element={<SportsCalculator />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
