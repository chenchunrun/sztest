import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { GraduationCap, X, Menu, Activity, Scale } from 'lucide-react';

export default function Navbar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '首页', id: 'hero' },
    { label: '智能填报', id: 'form' },
    { label: '学校库', id: 'schools' },
    { label: '填报规则', id: 'rules' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('hero')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base">Shenzhen High School Admission Application</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isHome ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-150"
                  >
                    {link.label}
                  </button>
                ))}
              </>
            ) : (
              <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-150">
                返回首页
              </Link>
            )}
            <Link
              to="/sports-calculator"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-150 flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5" />
              体育计算器
            </Link>
            <Link
              to="/compare"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-150 flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              学校对比
            </Link>
            {isHome && (
              <button
                onClick={() => onNavigate('form')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-lg hover:scale-[1.02] transition-transform duration-200 shadow-md"
              >
                开始填报
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 md:hidden">
          <div className="flex flex-col p-6 gap-4">
            {isHome ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                    className="text-lg text-gray-700 py-3 border-b border-gray-100 text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-lg text-gray-700 py-3 border-b border-gray-100 text-left"
              >
                返回首页
              </Link>
            )}
            <Link
              to="/sports-calculator"
              onClick={() => setMobileOpen(false)}
              className="text-lg text-gray-700 py-3 border-b border-gray-100 text-left flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              体育计算器
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileOpen(false)}
              className="text-lg text-gray-700 py-3 border-b border-gray-100 text-left flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              学校对比
            </Link>
            {isHome && (
              <button
                onClick={() => { onNavigate('form'); setMobileOpen(false); }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg"
              >
                开始填报
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
