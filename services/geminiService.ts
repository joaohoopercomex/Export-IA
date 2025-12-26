// FIX: Removed Schema import as it is not part of the documented public API in the guidelines.
import { GoogleGenAI, Type } from "@google/genai";
import { ExportFormData, AnalysisResponse, ProductIdentificationResponse } from "../types";
import { SYSTEM_INSTRUCTION, TRADE_AGREEMENTS } from "../constants";

// FIX: Removed Schema type annotation to align with guidelines; the type is inferred.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "Resumo executivo com principais riscos, oportunidades e contexto do país.",
    },
    fiscalAnalysis: {
      type: Type.STRING,
      description: "Análise fiscal completa detalhando tributos, regras, acordos e riscos técnicos.",
    },
    costTable: {
      type: Type.ARRAY,
      description: "Tabela de simulação de custos.",
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Nome do item de custo (ex: Valor FOB, Frete, II, VAT)" },
          value: { type: Type.STRING, description: "Valor formatado com moeda ou porcentagem (ex: US$ 10.000,00 ou 15%)" },
          rawValue: { type: Type.NUMBER, description: "Valor numérico absoluto estimado em Dólares (USD) para fins de gráfico." },
          note: { type: Type.STRING, description: "Nota explicativa curta (opcional)" },
        },
        required: ["item", "value", "rawValue"],
      },
    },
    finalLandedCost: {
      type: Type.STRING,
      description: "Texto destacando o preço nacionalizado final e breve análise de impacto.",
    },
    strategies: {
      type: Type.STRING,
      description: "Estratégias de otimização fiscal e logística.",
    },
    historicalData: {
      type: Type.ARRAY,
      description: "Dados históricos simulados do ComexStat para o NCM e país de destino nos últimos 12 meses.",
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING, description: "O mês/ano, ex: 'JAN/24'" },
          averageFobValue: { type: Type.NUMBER, description: "O valor FOB médio em USD para aquele mês." },
        },
        required: ["month", "averageFobValue"],
      },
    },
  },
  required: ["executiveSummary", "fiscalAnalysis", "costTable", "finalLandedCost", "strategies", "historicalData"],
};

// FIX: Removed Schema type annotation to align with guidelines; the type is inferred.
const identificationSchema = {
  type: Type.OBJECT,
  properties: {
    hsCode: { type: Type.STRING, description: "O código NCM / HS Code (mínimo 6 dígitos)" },
    description: { type: Type.STRING, description: "Descrição técnica e comercial concisa do produto em Português" },
    category: { type: Type.STRING, description: "Categoria macro do produto (ex: Têxtil, Eletrônicos, Alimentos)" },
    suggestedTransportMode: { type: Type.STRING, enum: ['Maritime', 'Air', 'Road'], description: "Modal de transporte mais comum para este tipo de carga" }
  },
  required: ["hsCode", "description", "category", "suggestedTransportMode"]
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
}

export const identifyProduct = async (input: string, type: 'desc' | 'ncm'): Promise<ProductIdentificationResponse> => {
  const ai = getClient();
  
  const prompt = type === 'desc' 
    ? `Identifique o código NCM / HS Code (Sistema Harmonizado) mais provável para a seguinte descrição de produto: "${input}". Forneça também uma descrição técnica padrão.`
    : `Identifique a descrição técnica comercial para o código NCM / HS Code: "${input}".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "Você é um classificador fiscal especialista. Retorne apenas JSON.",
      responseMimeType: "application/json",
      responseSchema: identificationSchema,
      temperature: 0.1,
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("No identification response");
  
  return JSON.parse(jsonText) as ProductIdentificationResponse;
};

export const analyzeExport = async (data: ExportFormData): Promise<AnalysisResponse> => {
  const ai = getClient();

  // Detecção de Acordo Comercial para reforçar no prompt
  const destination = data.destination.trim().toLowerCase();
  const agreementKey = Object.keys(TRADE_AGREEMENTS).find(key => key.toLowerCase() === destination);
  const agreement = agreementKey ? TRADE_AGREEMENTS[agreementKey] : null;

  const agreementContext = agreement 
    ? `ACORDO COMERCIAL DETECTADO: ${agreement.name} (${agreement.type}). Benefício: ${agreement.benefit}. Status: ${agreement.status}. Por favor, considere este acordo explicitamente nos cálculos de Imposto de Importação e na sua análise fiscal.`
    : "Não há acordos comerciais preferenciais conhecidos entre o Brasil e este destino. Utilize as tarifas MFN (Most Favored Nation).";

  const prompt = `
    País de Destino: ${data.destination}
    Produto: ${data.productDescription}
    NCM / HS Code: ${data.hsCode}
    Modal de Transporte: ${data.transportMode}
    Incoterm: ${data.incoterm}
    Valor FOB: ${data.currency} ${data.fobValue}
    Frete Internacional: ${data.currency} ${data.freightCost || "Não informado (Estimar conforme Knowledge Base)"}
    Seguro Internacional: ${data.currency} ${data.insuranceCost || "Não informado (Estimar conforme Knowledge Base)"}

    ${agreementContext}

    INSTRUÇÕES ESPECÍFICAS:
    1. Realize a simulação completa de exportação (Landed Cost).
    2. GERE OBRIGATORIAMENTE os dados históricos (ComexStat) conforme a instrução de sistema.
    3. Utilize o campo 'Produto' para contextualizar as regras (ex: se for 'têxtil' para EUA, considere as novas regras de fim do de minimis).
    4. Se o Seguro ou Frete forem 0/Não informados, ESTIME-OS baseando-se na 'Base de Conhecimento Técnico' fornecida no System Prompt, considerando especificamente o MODAL DE TRANSPORTE escolhido (${data.transportMode}).
    5. Verifique se o valor FOB se enquadra nos limites 'De Minimis' ou 'Regime Simplificado' do país de destino.
    6. Se houver acordo comercial conforme o contexto fornecido acima, aplique a redução tarifária.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response content from Gemini");
    }

    return JSON.parse(jsonText) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};