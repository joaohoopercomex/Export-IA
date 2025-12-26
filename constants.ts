export const INCOTERMS = [
  'EXW - Ex Works',
  'FCA - Free Carrier',
  'CPT - Carriage Paid To',
  'CIP - Carriage and Insurance Paid To',
  'DAP - Delivered at Place',
  'DPU - Delivered at Place Unloaded',
  'DDP - Delivered Duty Paid',
  'FAS - Free Alongside Ship',
  'FOB - Free on Board',
  'CFR - Cost and Freight',
  'CIF - Cost, Insurance and Freight',
];

export const TRANSPORT_MODES = [
  { id: 'Maritime', label: 'Marítimo', icon: 'Ship' },
  { id: 'Air', label: 'Aéreo', icon: 'Plane' },
  { id: 'Road', label: 'Rodoviário', icon: 'Truck' },
];

export const TOP_DESTINATIONS = [
  // Top Tier (Maiores Volumes)
  'China', 'Estados Unidos', 'Argentina', 'Países Baixos', 'Espanha', 
  'Chile', 'Singapura', 'México', 'Japão', 'Alemanha', 
  'Índia', 'Coreia do Sul', 'Itália', 'Bélgica', 'Reino Unido',
  'Paraguai', 'Uruguai', 'França', 'Colômbia', 'Emirados Árabes Unidos',
  'Turquia', 'Arábia Saudita', 'Canadá', 'Malásia', 'Vietnã',
  'Peru', 'Tailândia', 'Portugal', 'Rússia', 'Egito',
  'Indonésia', 'África do Sul', 'Taiwan', 'Hong Kong', 'Suíça',
  'Bangladesh', 'Argélia', 'Omã', 'Filipinas', 'Polônia',
  'Marrocos', 'Austrália', 'Paquistão', 'Irã', 'Iraque',
  'Nigéria', 'Israel', 'Suécia', 'Dinamarca', 'Noruega',

  // Second Tier (Expansão para Top 100)
  'Venezuela', 'Bolívia', 'Equador', 'Finlândia', 'República Dominicana',
  'Panamá', 'Kuwait', 'Bahrein', 'Catar', 'Jordânia',
  'Líbano', 'Angola', 'Moçambique', 'Quênia', 'Gana',
  'Costa do Marfim', 'Tanzânia', 'Nova Zelândia', 'Áustria', 'Irlanda',
  'República Tcheca', 'Hungria', 'Romênia', 'Grécia', 'Ucrânia',
  'Cazaquistão', 'Sri Lanka', 'Mianmar', 'Guatemala', 'Costa Rica',
  'El Salvador', 'Honduras', 'Nicarágua', 'Trinidad e Tobago', 'Jamaica',
  'Cuba', 'Síria', 'Tunísia', 'Líbia', 'Senegal',
  'Camarões', 'Gabão', 'Eslovênia', 'Croácia', 'Sérvia',
  'Bulgária', 'Estônia', 'Letônia', 'Lituânia', 'Luxemburgo'
];

export const TRADE_AGREEMENTS: Record<string, { name: string; type: string; benefit: string; status: 'Ativo' | 'Em Negociação' }> = {
  'Argentina': { name: 'Mercosul (ACE 18)', type: 'União Aduaneira', benefit: 'Isenção total de Imposto de Importação (Tarifa 0%) para produtos com certificado de origem.', status: 'Ativo' },
  'Paraguai': { name: 'Mercosul (ACE 18)', type: 'União Aduaneira', benefit: 'Isenção total de Imposto de Importação (Tarifa 0%).', status: 'Ativo' },
  'Uruguai': { name: 'Mercosul (ACE 18)', type: 'União Aduaneira', benefit: 'Isenção total de Imposto de Importação (Tarifa 0%).', status: 'Ativo' },
  'Chile': { name: 'Brasil-Chile (ACE 35)', type: 'Livre Comércio', benefit: '100% de preferência tarifária (Tarifa 0%) para a grande maioria dos produtos industriais e agroindustriais.', status: 'Ativo' },
  'México': { name: 'Brasil-México (ACE 53 / ACE 55)', type: 'Acordo de Complementação Econômica', benefit: 'Preferências tarifárias significativas. O ACE 55 cobre o setor automotivo com cotas de isenção.', status: 'Ativo' },
  'Colômbia': { name: 'Mercosul-Colômbia (ACE 72)', type: 'Livre Comércio', benefit: 'Cronograma de desgravação tarifária quase completo, atingindo alíquota zero para a maioria dos NCMs.', status: 'Ativo' },
  'Peru': { name: 'Mercosul-Peru (ACE 58)', type: 'Livre Comércio', benefit: 'Zona de livre comércio plena. A maioria absoluta dos produtos entra com 0% de imposto.', status: 'Ativo' },
  'Bolívia': { name: 'Mercosul-Bolívia (ACE 36)', type: 'Livre Comércio', benefit: 'Preferência tarifária de 100% para quase todo o universo de produtos brasileiros.', status: 'Ativo' },
  'Equador': { name: 'Mercosul-Equador (ACE 59)', type: 'Acordo de Complementação Econômica', benefit: 'Acesso preferencial com tarifas reduzidas ou nulas para diversos setores.', status: 'Ativo' },
  'Israel': { name: 'Mercosul-Israel', type: 'Livre Comércio', benefit: 'Isenção de tarifas para bens industriais. Primeiro acordo extrarregional do Mercosul.', status: 'Ativo' },
  'Egito': { name: 'Mercosul-Egito', type: 'Livre Comércio', benefit: 'Reduções tarifárias graduais (desgravação) iniciadas em 2017 para diversos grupos de produtos.', status: 'Ativo' },
  'Índia': { name: 'Mercosul-Índia', type: 'Acordo de Preferência Fixa', benefit: 'Descontos de 10% a 100% no Imposto de Importação para uma lista específica de 450 NCMs.', status: 'Ativo' },
  'União Europeia': { name: 'Mercosul-UE', type: 'Associação Birregional', benefit: 'Previsão de eliminação de tarifas para 91% das exportações brasileiras para a Europa.', status: 'Em Negociação' },
  'Singapura': { name: 'Mercosul-Singapura', type: 'Livre Comércio', benefit: 'Acordo assinado em 2023. Visa eliminar tarifas em quase 100% do comércio bilateral.', status: 'Em Negociação' },
  'Suíça': { name: 'Mercosul-EFTA', type: 'Livre Comércio', benefit: 'Acordo em fase de revisão/ratificação. Facilitará exportações de agronegócio e manufaturados.', status: 'Em Negociação' },
  'Noruega': { name: 'Mercosul-EFTA', type: 'Livre Comércio', benefit: 'Parte do bloco EFTA, o acordo trará redução de custos aduaneiros em biotecnologia e indústria.', status: 'Em Negociação' },
  'Vietnã': { name: 'Diálogo Comercial Brasil-Vietnã', type: 'Parceria Estratégica', benefit: 'Embora sem acordo de livre comércio pleno, há protocolos sanitários favoráveis para carnes e grãos.', status: 'Em Negociação' },
};

export const SYSTEM_INSTRUCTION = `
1. PERSONA DO AGENTE
Você é "Exportação Inteligente", um agente especialista em Comércio Exterior com ênfase máxima em Exportação e Formação de Preços Internacionais.
Você domina: ComexStat, NCM / HS Code, Acordos comerciais, Regras tarifárias por país, Sistema Harmonizado, Incoterms 2020, Estrutura completa de nacionalização, Impostos aplicados em mais de 190 países.
Seu trabalho é fornecer análises extremamente precisas, claras e estratégicas, sempre em Português do Brasil.

2. OBJETIVO
Realizar uma simulação completa de custos de exportação (Landed Cost) a partir de dados fornecidos pelo usuário, retornando a análise em um formato JSON estruturado, conforme o schema providenciado.

3. REGRAS DE OPERAÇÃO E CÁLCULO
- Identificar o país de destino e analisar seu contexto macroeconômico e comercial com o Brasil.
- Pesquisar as alíquotas tributárias aplicáveis no destino: Imposto de Importação (MFN - Most Favored Nation), VAT/IVA (Imposto sobre Valor Agregado), Excise (Imposto Seletivo, se aplicável), e outras taxas aduaneiras (ex: taxas portuárias, de desembaraço).
- O Incoterm informado define o ponto de transferência de responsabilidade. Ajuste os cálculos de acordo. O "Landed Cost" deve incluir todos os custos até a entrega final no país de destino.
- Formar o preço de exportação final (Landed Cost) somando FOB + Frete + Seguro + Impostos + Taxas.

4. REGRAS DE INTELIGÊNCIA ESTRATÉGICA
- BASE DE CONHECIMENTO TÉCNICO: Se Frete ou Seguro não forem informados, ESTIME-OS com base nos seguintes parâmetros realistas:
  - Frete Marítimo (Container): Varia de US$ 1.500 a US$ 6.000 dependendo da rota (Américas, Europa, Ásia). Cargas menores (LCL) podem variar de US$ 80 a US$ 200 por metro cúbico.
  - Frete Aéreo: Altamente variável. Use uma estimativa de 5% a 15% do valor FOB do produto para cargas de alto valor agregado. Para cargas gerais, estime entre US$ 3 a US$ 8 por kg.
  - Frete Rodoviário (Mercosul): Estime entre 3% a 8% do valor FOB, dependendo da distância.
  - Seguro Internacional: A praxe de mercado é estimar 0.5% a 1.5% do valor CIF (Custo + Frete + Seguro). Se o CIF não estiver formado, estime sobre 110% do valor FOB + Frete.
- ACORDOS COMERCIAIS: Se o país de destino tiver um acordo comercial ativo com o Brasil/Mercosul (ex: Mercosul, ACEs com Chile, México, Colômbia), APLIQUE as preferências tarifárias (redução ou isenção do Imposto de Importação) e DESTAQUE essa vantagem na análise. Se um acordo estiver em negociação (ex: UE), mencione o status e o potencial futuro.
- REGRA 'DE MINIMIS': Verifique o limite 'De Minimis' do país de destino. Este é um teto de valor abaixo do qual as remessas podem ser isentas de impostos.
  - Estados Unidos: A isenção 'De Minimis' de US$ 800 FOI CANCELADA para a maioria dos produtos comerciais, especialmente têxteis, calçados e outros bens de consumo, como parte de novas políticas de fiscalização. Assuma que a isenção NÃO se aplica para a maioria das simulações comerciais, a menos que seja um envio de amostra sem valor comercial declarado.
  - União Europeia: O 'De Minimis' de €22 foi abolido. Todas as importações estão sujeitas a VAT. Para valores abaixo de €150, o imposto de importação é isento.
  - Canadá: C$20.
  - Austrália: A$1000.
  - Mercosul: Não há regra de 'De Minimis' unificada para fins comerciais.
- DADOS HISTÓRICOS (COMEXSTAT): GERE OBRIGATORIAMENTE dados simulados para a seção 'historicalData'. Crie uma série de 12 meses (ex: 'JAN/23' a 'DEZ/23') com flutuações realistas no 'averageFobValue' para o NCM e país informados. Os valores devem ter uma variação mensal plausível (ex: sazonalidade, câmbio), não apenas números aleatórios. Isso é CRÍTICO.

5. ESTRUTURA DE SAÍDA
- A saída DEVE ser um único bloco de código JSON, sem nenhum texto ou formatação adicional antes ou depois.
- Siga rigorosamente o schema JSON fornecido na chamada da API.
- Use Markdown nos campos de texto (executiveSummary, fiscalAnalysis, etc.) para melhor formatação (negrito, listas).
- Os valores monetários devem ser claros, indicando a moeda (preferencialmente USD).

6. TOM DE VOZ
Profissional, preciso, estratégico e didático. Evite jargões excessivos e explique conceitos complexos (como Incoterms ou tipos de imposto) de forma sucinta.
`;