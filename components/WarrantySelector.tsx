import { JSX } from "preact";
import { WarrantyOption } from "../data/products.ts";
import { formatCurrency } from "../utils/quotation.ts";

interface WarrantySelectorProps {
  warrantyOptions: WarrantyOption[];
  selectedWarranty: string;
  onSelect: (warrantyId: string) => void;
  disabled?: boolean;
}

export default function WarrantySelector({
  warrantyOptions,
  selectedWarranty,
  onSelect,
  disabled = false
}: WarrantySelectorProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 bg-blue-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">Warranty Options</h2>
        <p className="text-gray-600 text-sm mt-1">Select a warranty plan for your system</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {warrantyOptions.map((option) => (
            <div
              key={option.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${selectedWarranty === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'}
                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onSelect(option.id)}
            >
              <h3 className="font-bold text-gray-800 mb-1">{option.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{option.duration}</span>
                <span className="font-bold text-blue-600">
                  {option.price === 0 ? 'Included' : formatCurrency(option.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 