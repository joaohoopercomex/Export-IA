import React from 'react';
import { History, Calculator } from 'lucide-react';

interface HeaderProps {
  currentView: 'calculator' | 'history';
  onToggleView: (view: 'calculator' | 'history') => void;
}

const Logo = () => (
  <svg viewBox="0 0 100 100" className="h-10 w-10 shadow-sm rounded-lg" xmlns="http://www.w3.org/2000/svg">
    {/* Fundo Azul */}
    <rect width="100" height="100" rx="20" fill="#1d4ed8" />
    
    {/* Cabeça / Perfil Abstrato */}
    <path d="M50 85 C30 85 20 70 20 55 C20 35 35 20 50 20 C65 20 80 35 80 55 C80 70 70 85 50 85" fill="#2563eb" />
    
    {/* Globo estilizado dentro (Mente) */}
    <circle cx="50" cy="50" r="22" fill="#3b82f6" stroke="white" strokeWidth="2" />
    <path d="M50 28 V 72" stroke="white" strokeWidth="1.5" opacity="0.6" />
    <path d="M28 50 H 72" stroke="white" strokeWidth="1.5" opacity="0.6" />
    <path d="M50 28 C65 28 65 72 50 72 C35 72 35 28 50 28" stroke="white" strokeWidth="1.5" opacity="0.6" fill="none" />
    
    {/* Lâmpada / Ideia na base */}
    <path d="M42 74 L44 82 H56 L58 74" fill="#fbbf24" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ currentView, onToggleView }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => onToggleView('calculator')}>
            <Logo />
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Exportação Inteligente</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Simulador de Custos & Tributos Internacionais</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onToggleView('calculator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'calculator' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Simular</span>
            </button>
            <button
              onClick={() => onToggleView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'history' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;