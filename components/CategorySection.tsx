import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Category, Product } from "../data/products.ts";
import { formatCurrency } from "../utils/quotation.ts";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  selectedProducts: Map<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export default function CategorySection({
  category,
  products,
  selectedProducts,
  onQuantityChange
}: CategorySectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter products by category
  const categoryProducts = products.filter(product => product.category === category.id);
  
  // Calculate if any product in this category is selected
  const hasSelectedProducts = categoryProducts.some(product => 
    (selectedProducts.get(product.id) || 0) > 0
  );
  
  // Count selected products
  const selectedCount = categoryProducts.reduce((count, product) => {
    const quantity = selectedProducts.get(product.id) || 0;
    return count + (quantity > 0 ? 1 : 0);
  }, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-6 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-xl font-medium text-gray-800">{category.name}</h3>
          {hasSelectedProducts && (
            <p className="text-sm text-blue-600 mt-1">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <p className="text-gray-600 mb-6">{category.description}</p>
          
          <div className="grid grid-cols-1 gap-4">
            {categoryProducts.map(product => {
              const quantity = selectedProducts.get(product.id) || 0;
              const isSelected = quantity > 0;
              
              return (
                <div 
                  key={product.id}
                  className={`border rounded-xl p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      </div>
                      <div className="font-medium text-gray-900">{formatCurrency(product.unitPrice)}</div>
                    </div>
                    
                    {isSelected && product.details && product.details.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-semibold uppercase text-gray-500 mb-2">Specifications</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {product.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        {!isSelected ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuantityChange(product.id, 1);
                              }}
                              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"
                              aria-label="Add"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Add</span>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuantityChange(product.id, 0);
                            }}
                            className="px-3 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                            aria-label="Remove"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center">
                          {category.id === "accessCard" ? (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="1"
                                  max={product.maxQuantity || 100}
                                  value={quantity}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newValue = parseInt(e.currentTarget.value, 10);
                                    if (!isNaN(newValue) && newValue >= 1 && (product.maxQuantity === undefined || newValue <= product.maxQuantity)) {
                                      onQuantityChange(product.id, newValue);
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-20 h-8 border border-gray-300 rounded px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="Quantity"
                                />
                                <span className="ml-2 text-sm text-gray-600">cards</span>
                              </div>
                              {quantity > 1 && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Total: {formatCurrency(product.unitPrice * quantity)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newQuantity = Math.max((quantity || 0) - 1, 1);
                                  onQuantityChange(product.id, newQuantity);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                                disabled={quantity <= 1}
                                aria-label="Decrease"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                              
                              <span className="w-8 text-center font-medium">{quantity}</span>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const max = product.maxQuantity !== undefined ? product.maxQuantity : 10;
                                  const newQuantity = Math.min((quantity || 0) + 1, max);
                                  onQuantityChange(product.id, newQuantity);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                                disabled={product.maxQuantity !== undefined && quantity >= product.maxQuantity}
                                aria-label="Increase"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 