import React from 'react';
import { SavedSimulation } from '../types';
import { Trash2, ExternalLink, Calendar, Package } from 'lucide-react';

interface HistoryListProps {
  history: SavedSimulation[];
  onLoad: (sim: SavedSimulation) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="mx-auto h-12 w-12 text-slate-300">
          <Package className="h-12 w-12" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhum histórico</h3>
        <p className="mt-1 text-sm text-slate-500">Salve suas simulações para acessá-las aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((sim) => {
        // Extração segura do preço final para exibição no card
        const displayPrice = sim.result.finalLandedCost
          ? sim.result.finalLandedCost.split('\n')[0]?.replace(/\*\*/g, '')
          : 'Preço calculado';

        return (
          <div key={sim.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{sim.formData.destination}</h3>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {sim.formData.hsCode}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-sm text-slate-500 gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(sim.timestamp).toLocaleDateString()} às {new Date(sim.timestamp).toLocaleTimeString()}
                  </span>
                  <span>{sim.formData.incoterm}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-700">
                  Resumo: {displayPrice}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoad(sim)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Carregar simulação"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(sim.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;