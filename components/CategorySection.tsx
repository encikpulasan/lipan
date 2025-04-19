import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Category, Product } from "../data/products.ts";
import ProductCard from "./ProductCard.tsx";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  selectedProducts: Map<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
  disabled?: boolean;
}

export default function CategorySection({
  category,
  products,
  selectedProducts,
  onQuantityChange,
  disabled = false
}: CategorySectionProps): JSX.Element {
  const [expanded, setExpanded] = useState(true);
  
  const filteredProducts = products.filter(product => product.category === category.id);
  
  // Check if at least one required product in the category has quantity > 0
  const hasRequiredProducts = category.required && 
    filteredProducts.some(p => p.required && (selectedProducts.get(p.id) ?? 0) > 0);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className={`px-6 py-4 cursor-pointer flex justify-between items-center border-b ${expanded ? 'bg-blue-50' : 'bg-white'}`}
        onClick={toggleExpanded}
      >
        <div>
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
            {category.required && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Required
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        </div>
        <div className="flex items-center">
          {category.required && !hasRequiredProducts && expanded && (
            <span className="text-red-500 text-sm mr-3">
              At least one item required
            </span>
          )}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={selectedProducts.get(product.id) ?? product.defaultQuantity ?? 0}
                onQuantityChange={onQuantityChange}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 