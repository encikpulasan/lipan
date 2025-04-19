import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import { categories, products, warrantyOptions, paymentOptions, ProjectInfo } from "../data/products.ts";
import { calculateTotal, generateQuotationNumber, calculateValidUntil, formatCurrency } from "../utils/quotation.ts";
import CategorySection from "../components/CategorySection.tsx";
import WarrantySelector from "../components/WarrantySelector.tsx";
import PaymentSelector from "../components/PaymentSelector.tsx";
import ProjectInfoForm from "../components/ProjectInfoForm.tsx";
import QuotationSummary from "../components/QuotationSummary.tsx";

export default function Configurator(): JSX.Element {
  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  
  // State for selected warranty
  const [selectedWarranty, setSelectedWarranty] = useState("standard");
  
  // State for selected payment option
  const [selectedPayment, setSelectedPayment] = useState("one-off");
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for project information
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: "",
    location: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });
  
  // State for validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInfo, string>>>({});
  
  // State for quotation
  const [quotation, setQuotation] = useState<{
    quotationNumber: string;
    date: Date;
    validUntil: Date;
    basePrice: number;
    totalPrice: number;
  } | null>(null);
  
  // Initialize selected products with default quantities
  useEffect(() => {
    const defaultSelectedProducts = new Map<string, number>();
    
    products.forEach(product => {
      // Initialize all products with 0 quantity
      defaultSelectedProducts.set(product.id, 0);
    });
    
    setSelectedProducts(defaultSelectedProducts);
  }, []);
  
  // Calculate base price (without payment option multiplier)
  const basePrice = calculateTotal(
    Array.from(selectedProducts.entries()).map(([productId, quantity]) => ({
      productId,
      quantity
    })),
    warrantyOptions.find(option => option.id === selectedWarranty)?.price || 0,
    products
  );
  
  // Get selected payment option
  const paymentOption = paymentOptions.find(option => option.id === selectedPayment);
  
  // Calculate total price with payment multiplier
  const totalPrice = calculateTotal(
    Array.from(selectedProducts.entries()).map(([productId, quantity]) => ({
      productId,
      quantity
    })),
    warrantyOptions.find(option => option.id === selectedWarranty)?.price || 0,
    products,
    paymentOption?.multiplier || 1
  );
  
  // Handle product quantity change
  const handleQuantityChange = (productId: string, quantity: number) => {
    const newSelectedProducts = new Map(selectedProducts);
    newSelectedProducts.set(productId, quantity);
    setSelectedProducts(newSelectedProducts);
  };
  
  // Handle warranty selection
  const handleWarrantySelect = (warrantyId: string) => {
    setSelectedWarranty(warrantyId);
  };
  
  // Handle payment option selection
  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };
  
  // Handle project info change
  const handleProjectInfoChange = (info: ProjectInfo) => {
    setProjectInfo(info);
    // Clear errors for fields that are now filled
    const newErrors = { ...errors };
    (Object.keys(info) as Array<keyof ProjectInfo>).forEach(key => {
      if (info[key] && newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  
  // Validate project info
  const validateProjectInfo = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectInfo, string>> = {};
    
    if (!projectInfo.name) {
      newErrors.name = "Project name is required";
    }
    
    if (!projectInfo.location) {
      newErrors.location = "Installation location is required";
    }
    
    if (!projectInfo.contactName) {
      newErrors.contactName = "Contact person name is required";
    }
    
    if (!projectInfo.contactPhone) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!/^[+\d\s()-]{8,}$/.test(projectInfo.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }
    
    if (!projectInfo.contactEmail) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectInfo.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Check if required products are selected
  const validateRequiredProducts = (): boolean => {
    // Since all products are now optional, always return true
    return true;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateRequiredProducts()) {
        setCurrentStep(2);
      } else {
        alert("Please select at least one required product from each required category.");
      }
    } else if (currentStep === 2) {
      if (validateProjectInfo()) {
        const date = new Date();
        const validUntil = calculateValidUntil(date);
        
        setQuotation({
          quotationNumber: generateQuotationNumber(),
          date,
          validUntil,
          basePrice,
          totalPrice
        });
        
        setCurrentStep(3);
      }
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle download PDF
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate a PDF
    alert("PDF download functionality would be implemented here.");
  };
  
  // Handle email quotation
  const handleEmailQuotation = () => {
    // In a real implementation, this would send an email
    alert(`Quotation would be emailed to ${projectInfo.contactEmail}`);
  };
  
  return (
    <section id="configurator" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Build Your Barrier Gate System</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Customize your security solution by selecting components based on your specific requirements.
          </p>
        </div>
        
        <div className="mb-10">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {currentStep === 1 ? "1. Select Your Components" :
               currentStep === 2 ? "2. Enter Project Information" :
               "3. Review Your Quotation"}
            </h3>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
        </div>
        
        {currentStep === 1 && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Configuration</h3>
                
                {Array.from(selectedProducts.entries()).filter(([_, quantity]) => quantity > 0).length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* List all selected products grouped by category */}
                      {categories.map(category => {
                        // Get products in this category that are selected
                        const selectedCategoryProducts = products.filter(
                          p => p.category === category.id && (selectedProducts.get(p.id) || 0) > 0
                        );
                        
                        if (selectedCategoryProducts.length === 0) return null;
                        
                        return (
                          <div key={category.id} className="pb-4 border-b border-gray-100">
                            <h4 className="font-medium text-blue-600 mb-2">{category.name}</h4>
                            
                            <div className="space-y-3">
                              {selectedCategoryProducts.map(product => {
                                const quantity = selectedProducts.get(product.id) || 0;
                                return (
                                  <div key={product.id} className="flex justify-between">
                                    <div>
                                      <div className="font-medium text-gray-800">{product.name}</div>
                                      <div className="text-sm text-gray-600">
                                        Qty: {quantity} × {formatCurrency(product.unitPrice)}
                                      </div>
                                    </div>
                                    <div className="text-right font-medium">
                                      {formatCurrency(product.unitPrice * quantity)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Total</h3>
                        <div className="flex flex-col items-end">
                          {basePrice !== totalPrice && (
                            <div className="text-sm text-gray-600 mb-1">
                              Base price: {formatCurrency(basePrice)}
                            </div>
                          )}
                          <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalPrice)}</div>
                          {selectedPayment !== 'one-off' && paymentOption?.type === 'rental' && (
                            <div className="text-sm text-gray-600 mt-1">
                              Starting from {formatCurrency((totalPrice * (paymentOption.multiplier || 0)) / (paymentOption.termMonths || 1))}/month
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="font-medium text-gray-800 mb-2">Selected Options:</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {warrantyOptions.find(w => w.id === selectedWarranty)?.name || 'Standard Warranty'}
                          </div>
                          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {paymentOptions.find(p => p.id === selectedPayment)?.name || 'One-time Payment'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">No items selected</h4>
                    <p className="text-gray-600">
                      Select components from the right panel to build your barrier gate system.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="space-y-8">
                <div className="space-y-6">
                  {categories.map(category => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={products}
                      selectedProducts={selectedProducts}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Warranty</h3>
                  <p className="text-gray-600 mb-6">Choose the warranty option that provides the coverage you need.</p>
                  
                  <WarrantySelector
                    warrantyOptions={warrantyOptions}
                    selectedWarranty={selectedWarranty}
                    onSelect={handleWarrantySelect}
                  />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Options</h3>
                  <p className="text-gray-600 mb-6">Choose the payment option that works best for your budget.</p>
                  
                  <PaymentSelector
                    paymentOptions={paymentOptions}
                    selectedPayment={selectedPayment}
                    onSelect={handlePaymentSelect}
                    basePrice={basePrice}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left panel - Preview and details */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Configuration</h3>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* List all selected products grouped by category */}
                    {categories.map(category => {
                      // Get products in this category that are selected
                      const selectedCategoryProducts = products.filter(
                        p => p.category === category.id && (selectedProducts.get(p.id) || 0) > 0
                      );
                      
                      if (selectedCategoryProducts.length === 0) return null;
                      
                      return (
                        <div key={category.id} className="pb-4 border-b border-gray-100">
                          <h4 className="font-medium text-blue-600 mb-2">{category.name}</h4>
                          
                          <div className="space-y-3">
                            {selectedCategoryProducts.map(product => {
                              const quantity = selectedProducts.get(product.id) || 0;
                              return (
                                <div key={product.id} className="flex justify-between">
                                  <div>
                                    <div className="font-medium text-gray-800">{product.name}</div>
                                    <div className="text-sm text-gray-600">
                                      Qty: {quantity} × {formatCurrency(product.unitPrice)}
                                    </div>
                                  </div>
                                  <div className="text-right font-medium">
                                    {formatCurrency(product.unitPrice * quantity)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Total</h3>
                      <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalPrice)}</div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="font-medium text-gray-800 mb-2">Selected Options:</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {warrantyOptions.find(w => w.id === selectedWarranty)?.name || 'Standard Warranty'}
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {paymentOptions.find(p => p.id === selectedPayment)?.name || 'One-time Payment'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                      <ol className="text-sm text-blue-700 space-y-2 list-decimal pl-5">
                        <li>We'll prepare your detailed quotation</li>
                        <li>Our team will contact you within 24 hours</li>
                        <li>Schedule a site inspection if needed</li>
                        <li>Confirm installation date and details</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right panel - Project information form */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Information</h3>
                <p className="text-gray-600 mb-6">Fill in your details to generate your quotation.</p>
                
                <ProjectInfoForm
                  projectInfo={projectInfo}
                  onChange={handleProjectInfoChange}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 3 && quotation && (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left panel - Preview and details */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quotation Summary</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex flex-wrap justify-between mb-2">
                      <div>
                        <span className="text-sm text-gray-600">Quotation #:</span>
                        <span className="ml-1 font-medium">{quotation.quotationNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="ml-1 font-medium">{quotation.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Valid until: {quotation.validUntil.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* List all selected products grouped by category */}
                    {categories.map(category => {
                      // Get products in this category that are selected
                      const selectedCategoryProducts = products.filter(
                        p => p.category === category.id && (selectedProducts.get(p.id) || 0) > 0
                      );
                      
                      if (selectedCategoryProducts.length === 0) return null;
                      
                      return (
                        <div key={category.id} className="pb-4 border-b border-gray-100">
                          <h4 className="font-medium text-blue-600 mb-2">{category.name}</h4>
                          
                          <div className="space-y-3">
                            {selectedCategoryProducts.map(product => {
                              const quantity = selectedProducts.get(product.id) || 0;
                              return (
                                <div key={product.id} className="flex justify-between">
                                  <div>
                                    <div className="font-medium text-gray-800">{product.name}</div>
                                    <div className="text-sm text-gray-600">
                                      Qty: {quantity} × {formatCurrency(product.unitPrice)}
                                    </div>
                                  </div>
                                  <div className="text-right font-medium">
                                    {formatCurrency(product.unitPrice * quantity)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Total</h3>
                      <div className="flex flex-col items-end">
                        {basePrice !== totalPrice && (
                          <div className="text-sm text-gray-600 mb-1">
                            Base price: {formatCurrency(basePrice)}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalPrice)}</div>
                        {selectedPayment !== 'one-off' && paymentOption?.type === 'rental' && (
                          <div className="text-sm text-gray-600 mt-1">
                            Starting from {formatCurrency((totalPrice * (paymentOption.multiplier || 0)) / (paymentOption.termMonths || 1))}/month
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="font-medium text-gray-800 mb-2">Selected Options:</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {warrantyOptions.find(w => w.id === selectedWarranty)?.name || 'Standard Warranty'}
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {paymentOptions.find(p => p.id === selectedPayment)?.name || 'One-time Payment'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleDownloadPDF}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download PDF
                        </button>
                        
                        <button
                          onClick={handleEmailQuotation}
                          className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg border border-blue-600 transition flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                          Email Quotation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right panel - Quotation summary */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-medium">Project:</span> {projectInfo.name}</p>
                      <p><span className="font-medium">Location:</span> {projectInfo.location}</p>
                      <p><span className="font-medium">Contact:</span> {projectInfo.contactName}</p>
                      <p><span className="font-medium">Phone:</span> {projectInfo.contactPhone}</p>
                      <p><span className="font-medium">Email:</span> {projectInfo.contactEmail}</p>
                      {projectInfo.notes && (
                        <p><span className="font-medium">Notes:</span> {projectInfo.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                    <p className="text-blue-700 text-sm mb-4">
                      Your quotation has been generated. Our team will contact you within 24 hours to discuss your requirements in detail.
                    </p>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal pl-5">
                      <li>Review your quotation details</li>
                      <li>Download or email your quotation for reference</li>
                      <li>Expect a call from our team within 24 hours</li>
                      <li>Schedule installation at your convenience</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={handlePreviousStep}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Previous Step
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              {currentStep === 1 ? "Continue to Project Info" : "Generate Quotation"}
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </section>
  );
} 