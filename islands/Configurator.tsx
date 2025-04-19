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
      if (product.required || product.defaultQuantity > 0) {
        defaultSelectedProducts.set(product.id, product.defaultQuantity);
      }
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
    for (const category of categories) {
      if (category.required) {
        const categoryProducts = products.filter(p => p.category === category.id && p.required);
        if (categoryProducts.length > 0) {
          const hasRequiredProduct = categoryProducts.some(product => 
            (selectedProducts.get(product.id) || 0) > 0
          );
          
          if (!hasRequiredProduct) {
            return false;
          }
        }
      }
    }
    
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
          <div>
            {categories.map(category => (
              <CategorySection
                key={category.id}
                category={category}
                products={products}
                selectedProducts={selectedProducts}
                onQuantityChange={handleQuantityChange}
              />
            ))}
            
            <WarrantySelector
              warrantyOptions={warrantyOptions}
              selectedWarranty={selectedWarranty}
              onSelect={handleWarrantySelect}
            />
            
            <PaymentSelector
              paymentOptions={paymentOptions}
              selectedPayment={selectedPayment}
              onSelect={handlePaymentSelect}
              basePrice={basePrice}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <ProjectInfoForm
            projectInfo={projectInfo}
            onChange={handleProjectInfoChange}
            errors={errors}
          />
        )}
        
        {currentStep === 3 && quotation && (
          <div>
            <QuotationSummary
              selectedProducts={selectedProducts}
              products={products}
              selectedWarranty={selectedWarranty}
              warrantyOptions={warrantyOptions}
              selectedPayment={selectedPayment}
              paymentOptions={paymentOptions}
              basePrice={quotation.basePrice}
              totalPrice={quotation.totalPrice}
              quotationNumber={quotation.quotationNumber}
              date={quotation.date}
              validUntil={quotation.validUntil}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
              <p className="text-gray-600 mb-6">
                Your quotation has been generated. You can download it as a PDF or have it emailed to you.
                Our team will contact you within 24 hours to discuss your requirements in more detail.
              </p>
              
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