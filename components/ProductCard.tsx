import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Product } from "../data/products.ts";
import { formatCurrency } from "../utils/quotation.ts";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  disabled?: boolean;
}

export default function ProductCard({ 
  product, 
  quantity, 
  onQuantityChange,
  disabled = false
}: ProductCardProps): JSX.Element {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleIncrement = () => {
    if (product.maxQuantity !== undefined && quantity >= product.maxQuantity) return;
    onQuantityChange(product.id, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (product.minQuantity !== undefined && quantity <= product.minQuantity) return;
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };
  
  const handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newQuantity = parseInt(input.value);
    
    if (isNaN(newQuantity)) return;
    
    if (product.minQuantity !== undefined && newQuantity < product.minQuantity) {
      onQuantityChange(product.id, product.minQuantity);
      return;
    }
    
    if (product.maxQuantity !== undefined && newQuantity > product.maxQuantity) {
      onQuantityChange(product.id, product.maxQuantity);
      return;
    }
    
    onQuantityChange(product.id, newQuantity);
  };
  
  const totalPrice = quantity * product.unitPrice;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 border ${quantity > 0 ? 'border-blue-300' : 'border-gray-200'}`}>
      <div className="p-5">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
          {product.required && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Required</span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-blue-600">{formatCurrency(product.unitPrice)}</div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDecrement}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
              disabled={disabled || quantity <= (product.minQuantity ?? 0)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <input 
              type="number" 
              value={quantity} 
              onChange={handleInputChange}
              min={product.minQuantity ?? 0}
              max={product.maxQuantity}
              className="w-12 text-center border border-gray-300 rounded"
              disabled={disabled}
            />
            <button 
              onClick={handleIncrement}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
              disabled={disabled || (product.maxQuantity !== undefined && quantity >= product.maxQuantity)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
        
        {quantity > 0 && (
          <div className="text-right font-medium text-blue-800">
            Total: {formatCurrency(totalPrice)}
          </div>
        )}
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-3"
        >
          {showDetails ? "Hide Details" : "Show Details"}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      
      {showDetails && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Specifications:</h4>
          <ul className="text-sm space-y-1 list-disc pl-5">
            {product.details.map((detail, index) => (
              <li key={index} className="text-gray-600">{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 