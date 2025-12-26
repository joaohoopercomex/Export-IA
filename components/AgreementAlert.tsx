import React from 'react';
import { Handshake, Info } from 'lucide-react';
import { TRADE_AGREEMENTS } from '../constants';

interface AgreementAlertProps {
  country: string;
}

const AgreementAlert: React.FC<AgreementAlertProps> = ({ country }) => {
  if (!country) return null;

  // Busca Case-Insensitive para robustez
  const normalizedInput = country.trim().toLowerCase();
  const agreementKey = Object.keys(TRADE_AGREEMENTS).find(
    key => key.toLowerCase() === normalizedInput
  );
  
  const agreement = agreementKey ? TRADE_AGREEMENTS[agreementKey] : null;

  if (!agreement) return null;

  const isNegotiation = agreement.status === 'Em Negociação';
  const bgColor = isNegotiation ? 'bg-amber-50' : 'bg-emerald-50';
  const borderColor = isNegotiation ? 'border-amber-200' : 'border-emerald-200';
  const textColor = isNegotiation ? 'text-amber-800' : 'text-emerald-800';
  const iconColor = isNegotiation ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className={`mt-4 border-l-4 ${borderColor} ${bgColor} p-4 rounded-r-md shadow-sm transition-all duration-500`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isNegotiation ? (
            <Info className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
          ) : (
            <Handshake className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-semibold ${textColor}`}>
            {isNegotiation ? 'Acordo em Negociação Detectado' : 'Oportunidade de Acordo Comercial'}
          </h3>
          <div className={`mt-1 text-sm ${textColor} opacity-90`}>
            <p>
              <span className="font-bold">{agreement.name}</span> ({agreement.type})
            </p>
            <p className="mt-1">
              {agreement.benefit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementAlert;