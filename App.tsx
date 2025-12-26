import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Box, Check, Loader2, Save,
  Ship, Plane, Truck, Anchor, DollarSign, 
  MapPin, TrendingUp, AlertTriangle, FileText,
  BarChart3, ShieldCheck, Lightbulb, CheckCircle2,
  Sparkles, Hash, TextCursor
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Header from './components/Header';
import AgreementAlert from './components/AgreementAlert';
import HistoryList from './components/HistoryList';
import { analyzeExport, identifyProduct } from './services/geminiService';
import { saveSimulation, loadHistory, deleteSimulation } from './services/storageService';
import { ExportFormData, AnalysisResponse, LoadingState, SavedSimulation, TransportMode, HistoricalDataItem } from './types';
import { INCOTERMS, TOP_DESTINATIONS, TRANSPORT_MODES } from './constants';

const initialFormData: ExportFormData = {
  destination: '',
  productDescription: '',
  hsCode: '',
  transportMode: 'Maritime',
  incoterm: 'FOB - Free on Board',
  fobValue: 0,
  freightCost: 0,
  insuranceCost: 0,
  currency: 'USD',
};

type TabId = 'summary' | 'fiscal' | 'table' | 'strategies' | 'historyChart';

const BarChart: React.FC<{ data: HistoricalDataItem[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <BarChart3 className="mx-auto h-8 w-8 mb-2" />
        <p>Não há dados históricos suficientes para este NCM/País.</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.averageFobValue));
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Valor FOB Médio Mensal (Últimos 12 meses)</h3>
        <p className="text-sm text-slate-500 mb-6">Fonte: Simulação baseada em dados históricos (ComexStat). Os valores indicam o preço médio por unidade de medida padrão do NCM.</p>
        <div className="w-full h-72 bg-slate-50/50 rounded-lg p-4 flex items-end justify-around gap-2 border border-slate-200">
          {data.map((item, index) => {
             const barHeight = maxValue > 0 ? (item.averageFobValue / maxValue) * 100 : 0;
             return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                 <div className="text-xs font-medium text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatter.format(item.averageFobValue)}
                 </div>
                 <div 
                    className="w-full bg-indigo-200 hover:bg-indigo-400 rounded-t-md transition-all duration-300 ease-out"
                    style={{ height: `${barHeight}%` }}
                    title={`${item.month}: ${formatter.format(item.averageFobValue)}`}
                 ></div>
                 <div className="w-full text-center text-[10px] font-medium text-slate-500 pt-1 mt-1 border-t border-slate-300">
                    {item.month}
                 </div>
              </div>
             )
          })}
        </div>
    </div>
  )
};

function App() {
  const [formData, setFormData] = useState<ExportFormData>(initialFormData);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [view, setView] = useState<'calculator' | 'history'>('calculator');
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('summary');

  // New State for Product Identification
  const [productInputMode, setProductInputMode] = useState<'desc' | 'ncm'>('desc');
  const [identifyingProduct, setIdentifyingProduct] = useState(false);
  const [identificationInput, setIdentificationInput] = useState('');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Value') || name.includes('Cost') ? parseFloat(value) || 0 : value
    }));
  };

  const handleTransportSelect = (mode: TransportMode) => {
    setFormData(prev => ({ ...prev, transportMode: mode }));
  };

  const handleIdentifyProduct = async () => {
    if (!identificationInput.trim()) return;
    
    setIdentifyingProduct(true);
    setErrorMessage('');
    
    try {
      const result = await identifyProduct(identificationInput, productInputMode);
      setFormData(prev => ({
        ...prev,
        hsCode: result.hsCode,
        productDescription: result.description,
        transportMode: result.suggestedTransportMode // Auto-suggest transport too!
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage('Não foi possível identificar o produto. Tente detalhar mais ou preencha manualmente.');
    } finally {
      setIdentifyingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productDescription || !formData.hsCode) {
      setErrorMessage("Por favor, preencha a descrição do produto e o NCM.");
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setErrorMessage('');
    setAnalysis(null);
    setLastSavedId(null);
    setActiveTab('summary');

    try {
      const result = await analyzeExport(formData);
      setAnalysis(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      setErrorMessage('Ocorreu um erro ao processar a simulação. Verifique sua conexão ou tente novamente.');
    }
  };

  const handleSave = () => {
    if (analysis) {
      const saved = saveSimulation(formData, analysis);
      setHistory(loadHistory());
      setLastSavedId(saved.id);
    }
  };

  const handleLoadSimulation = (sim: SavedSimulation) => {
    setFormData(sim.formData);
    setAnalysis(sim.result);
    setIdentificationInput(sim.formData.productDescription); 
    setProductInputMode('desc');
    setView('calculator');
    setLastSavedId(sim.id);
    setActiveTab('summary');
  };

  const handleDeleteSimulation = (id: string) => {
    const updatedHistory = deleteSimulation(id);
    setHistory(updatedHistory);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <Header currentView={view} onToggleView={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'history' ? (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              Histórico de Simulações
            </h2>
            <HistoryList 
              history={history} 
              onLoad={handleLoadSimulation} 
              onDelete={handleDeleteSimulation} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: FORM */}
            <div className={`lg:col-span-4 space-y-6 ${analysis ? 'xl:block' : 'lg:col-start-4 lg:col-span-6'}`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION 1: PRODUCT & MARKET */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <Box className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Produto & Mercado</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    
                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">País de Destino</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input 
                          list="destinations" 
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
                          placeholder="Selecione ou digite..."
                          required
                        />
                        <datalist id="destinations">
                          {TOP_DESTINATIONS.map(d => <option key={d} value={d} />)}
                        </datalist>
                      </div>
                      <AgreementAlert country={formData.destination} />
                    </div>

                    {/* PRODUCT IDENTIFICATION (AI POWERED) */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setProductInputMode('desc')}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                            productInputMode === 'desc' 
                              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <TextCursor className="h-3.5 w-3.5" />
                          Por Descrição
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductInputMode('ncm')}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                            productInputMode === 'ncm' 
                              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <Hash className="h-3.5 w-3.5" />
                          Por NCM
                        </button>
                      </div>

                      <div className="relative">
                         <div className="flex gap-2">
                            <input
                              type="text"
                              value={identificationInput}
                              onChange={(e) => setIdentificationInput(e.target.value)}
                              className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                              placeholder={productInputMode === 'desc' ? "Ex: Camisetas de algodão..." : "Ex: 6109.10.00"}
                            />
                            <button
                              type="button"
                              onClick={handleIdentifyProduct}
                              disabled={identifyingProduct || !identificationInput}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
                              title="Identificar e Preencher Automaticamente"
                            >
                              {identifyingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            </button>
                         </div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        A IA irá preencher automaticamente os campos técnicos abaixo.
                      </p>
                    </div>

                    {/* AUTO-FILLED FIELDS */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Descrição Técnica (Resultado)</label>
                        <input
                          type="text"
                          name="productDescription"
                          value={formData.productDescription}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-slate-200 bg-slate-50 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1.5 border px-3"
                          readOnly={productInputMode === 'desc' && !identifyingProduct && formData.productDescription !== ''}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">NCM / HS Code (Resultado)</label>
                        <input
                          type="text"
                          name="hsCode"
                          value={formData.hsCode}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-slate-200 bg-slate-50 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1.5 border px-3 font-mono"
                          readOnly={productInputMode === 'ncm' && !identifyingProduct && formData.hsCode !== ''}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* SECTION 2: LOGISTICS */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Logística Internacional</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    
                    {/* Transport Mode */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Modal de Transporte</label>
                      <div className="grid grid-cols-3 gap-3">
                        {TRANSPORT_MODES.map((mode) => {
                           const Icon = mode.icon === 'Ship' ? Ship : mode.icon === 'Plane' ? Plane : Truck;
                           return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => handleTransportSelect(mode.id as TransportMode)}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                                formData.transportMode === mode.id
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
                              }`}
                            >
                              <Icon className="h-6 w-6 mb-1" />
                              {mode.label}
                            </button>
                           )
                        })}
                      </div>
                    </div>

                    {/* Incoterm */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Incoterm (2020)</label>
                      <select
                        name="incoterm"
                        value={formData.incoterm}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                      >
                        {INCOTERMS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>

                  </div>
                </div>

                {/* SECTION 3: VALUES */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Valores da Operação</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Moeda</label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                          >
                            <option value="USD">USD - Dólar Americano</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="BRL">BRL - Real</option>
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Valor FOB Total</label>
                          <input
                            type="number"
                            name="fobValue"
                            value={formData.fobValue || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                            placeholder="0.00"
                            required
                          />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Frete Int. (Opcional)</label>
                          <input
                            type="number"
                            name="freightCost"
                            value={formData.freightCost || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                            placeholder="IA estima se vazio"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Seguro Int. (Opcional)</label>
                          <input
                            type="number"
                            name="insuranceCost"
                            value={formData.insuranceCost || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
                            placeholder="IA estima se vazio"
                          />
                        </div>
                     </div>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingState === LoadingState.LOADING}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all"
                >
                  {loadingState === LoadingState.LOADING ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Calculando Cenários...
                    </>
                  ) : (
                    <>
                      Simular Exportação
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>
                
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

              </form>
            </div>

            {/* RIGHT COLUMN: ANALYSIS RESULTS */}
            <div className="lg:col-span-8">
              {!analysis ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center text-slate-500">
                  <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <Lightbulb className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Aguardando Dados</h3>
                  <p className="max-w-md mt-2">
                    Preencha o formulário para iniciar a simulação. 
                    Nossa IA analisará tributos, acordos e logística para seu destino.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Results Header */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Análise de Exportação</h2>
                      <div className="flex items-center gap-2 mt-1 text-slate-500">
                         <span>{formData.destination}</span>
                         <span>•</span>
                         <span className="font-mono bg-slate-100 px-2 rounded text-xs">{formData.hsCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={lastSavedId !== null}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        lastSavedId 
                          ? 'bg-green-50 text-green-700 cursor-default' 
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      {lastSavedId ? (
                         <>
                           <Check className="h-4 w-4" />
                           Salvo
                         </>
                      ) : (
                         <>
                           <Save className="h-4 w-4" />
                           Salvar Simulação
                         </>
                      )}
                    </button>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200">
                      <nav className="flex -mb-px" aria-label="Tabs">
                        {[
                          { id: 'summary', label: 'Resumo', icon: FileText },
                          { id: 'historyChart', label: 'Dados Históricos', icon: TrendingUp },
                          { id: 'table', label: 'Custos', icon: BarChart3 },
                          { id: 'fiscal', label: 'Análise Fiscal', icon: ShieldCheck },
                          { id: 'strategies', label: 'Estratégias', icon: Lightbulb },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as TabId)}
                              className={`flex-1 group inline-flex items-center justify-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                isActive
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                              <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="p-6">
                      {/* TAB: SUMMARY */}
                      {activeTab === 'summary' && (
                        <div className="prose prose-slate max-w-none">
                          <ReactMarkdown>{analysis.executiveSummary}</ReactMarkdown>
                          <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                             <h4 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                               <CheckCircle2 className="h-5 w-5" />
                               Preço Nacionalizado Estimado
                             </h4>
                             <div className="text-indigo-800">
                               <ReactMarkdown>{analysis.finalLandedCost}</ReactMarkdown>
                             </div>
                          </div>
                        </div>
                      )}
                      
                      {/* TAB: HISTORICAL DATA CHART */}
                      {activeTab === 'historyChart' && (
                         <BarChart data={analysis.historicalData} />
                      )}

                      {/* TAB: FISCAL */}
                      {activeTab === 'fiscal' && (
                        <div className="prose prose-slate max-w-none">
                          <ReactMarkdown>{analysis.fiscalAnalysis}</ReactMarkdown>
                        </div>
                      )}

                      {/* TAB: COST TABLE */}
                      {activeTab === 'table' && (
                        <div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item de Custo</th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Estimado</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notas</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-200">
                                {analysis.costTable.map((row, idx) => (
                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{row.item}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700 font-bold">{row.value}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{row.note}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-4 text-xs text-slate-500 text-center italic">
                            * Valores simulados baseados em alíquotas médias. Câmbio e taxas locais podem variar no momento do desembaraço.
                          </div>
                        </div>
                      )}

                      {/* TAB: STRATEGIES */}
                      {activeTab === 'strategies' && (
                        <div className="prose prose-slate max-w-none">
                          <ReactMarkdown>{analysis.strategies}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;