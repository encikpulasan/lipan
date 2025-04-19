import { JSX } from "preact";
import { PaymentOption } from "../data/products.ts";
import { formatCurrency } from "../utils/quotation.ts";

interface PaymentSelectorProps {
  paymentOptions: PaymentOption[];
  selectedPayment: string;
  onSelect: (paymentId: string) => void;
  basePrice: number;
}

export default function PaymentSelector({ 
  paymentOptions, 
  selectedPayment, 
  onSelect,
  basePrice
}: PaymentSelectorProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Options</h3>
      <p className="text-gray-600 mb-6">
        Choose the payment option that works best for your budget and needs.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentOptions.map((option) => {
          // Calculate price based on payment option
          const totalPrice = basePrice * (option.multiplier || 1);
          const monthlyPrice = option.type === 'rental' || option.type === 'lease' 
            ? (totalPrice / (option.termMonths || 1)).toFixed(2) 
            : null;
            
          return (
            <div 
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedPayment === option.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{option.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border ${
                    selectedPayment === option.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPayment === option.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                {option.type === 'one-off' && (
                  <div className="font-bold text-lg text-blue-700">
                    {formatCurrency(totalPrice)}
                  </div>
                )}
                
                {(option.type === 'rental' || option.type === 'lease') && (
                  <div>
                    <div className="font-bold text-lg text-blue-700">
                      {formatCurrency(parseFloat(monthlyPrice || "0"))}/month
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      for {option.termMonths} months ({formatCurrency(totalPrice)} total)
                    </div>
                  </div>
                )}
              </div>
              
              {option.features && option.features.length > 0 && (
                <div className="mt-4">
                  <ul className="text-sm">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-start mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-green-500 mr-2 flex-shrink-0">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 