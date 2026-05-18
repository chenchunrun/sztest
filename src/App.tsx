import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import SchoolDetail from '@/pages/SchoolDetail';
import SportsCalculator from '@/pages/SportsCalculator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/school/:id" element={<SchoolDetail />} />
      <Route path="/sports-calculator" element={<SportsCalculator />} />
    </Routes>
  );
}

export default App;
