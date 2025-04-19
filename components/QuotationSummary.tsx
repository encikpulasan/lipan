import { JSX } from "preact";
import { Product, Quotation, WarrantyOption, PaymentOption } from "../data/products.ts";
import { formatCurrency, calculatePaymentDetails } from "../utils/quotation.ts";

interface QuotationSummaryProps {
  selectedProducts: Map<string, number>;
  products: Product[];
  selectedWarranty: string;
  warrantyOptions: WarrantyOption[];
  selectedPayment: string;
  paymentOptions: PaymentOption[];
  basePrice: number;
  totalPrice: number;
  quotationNumber?: string;
  date?: Date;
  validUntil?: Date;
}

export default function QuotationSummary({
  selectedProducts,
  products,
  selectedWarranty,
  warrantyOptions,
  selectedPayment,
  paymentOptions,
  basePrice,
  totalPrice,
  quotationNumber,
  date,
  validUntil
}: QuotationSummaryProps): JSX.Element {
  const productEntries = Array.from(selectedProducts.entries())
    .filter(([_, quantity]) => quantity > 0)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return { product, quantity };
    })
    .filter(({ product }) => product !== undefined);
  
  const warranty = warrantyOptions.find(w => w.id === selectedWarranty);
  const paymentOption = paymentOptions.find(p => p.id === selectedPayment);
  
  const paymentDetails = calculatePaymentDetails(totalPrice, paymentOption);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quotation Summary</h2>
            <p className="text-gray-600 text-sm mt-1">Review your selected products and total cost</p>
          </div>
          {quotationNumber && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Quotation #:</div>
              <div className="font-medium text-gray-800">{quotationNumber}</div>
              {date && (
                <div className="text-sm text-gray-600 mt-2">
                  Date: {date.toLocaleDateString()}
                </div>
              )}
              {validUntil && (
                <div className="text-sm text-gray-600">
                  Valid until: {validUntil.toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productEntries.map(({ product, quantity }) => product && (
                <tr key={product.id}>
                  <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">{quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                    {formatCurrency(product.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                    {formatCurrency(product.unitPrice * quantity)}
                  </td>
                </tr>
              ))}
              
              {warranty && (
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-800">{warranty.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">1</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                    {warranty.price === 0 ? 'Included' : formatCurrency(warranty.price)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                    {warranty.price === 0 ? 'Included' : formatCurrency(warranty.price)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-3 text-base font-bold text-gray-800 text-right">
                  Subtotal
                </td>
                <td className="px-4 py-3 text-base font-bold text-gray-800 text-right">
                  {formatCurrency(basePrice)}
                </td>
              </tr>
              {paymentOption && paymentOption.type !== 'one-off' && (
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-base font-bold text-gray-800 text-right">
                    Total {paymentOption.type === 'lease' ? 'Financed ' : 'Contract '} 
                    Amount
                  </td>
                  <td className="px-4 py-3 text-base font-bold text-blue-700 text-right">
                    {formatCurrency(paymentDetails.totalCost)}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
        
        {/* Payment details section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Payment Option:</h4>
                <p className="text-blue-800 font-bold">{paymentOption?.name || 'One-time Payment'}</p>
                <p className="text-sm text-gray-600 mt-1">{paymentOption?.description}</p>
              </div>
              
              {paymentOption?.type === 'one-off' && (
                <div className="mt-4 md:mt-0">
                  <h4 className="font-medium text-gray-700">Total Due:</h4>
                  <p className="text-blue-800 font-bold text-xl">{formatCurrency(totalPrice)}</p>
                </div>
              )}
              
              {paymentOption?.type === 'lease' && paymentDetails.monthlyPayment && (
                <div className="mt-4 md:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Initial Deposit:</h4>
                      <p className="text-blue-800 font-bold">{formatCurrency(paymentDetails.deposit)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Monthly Payment:</h4>
                      <p className="text-blue-800 font-bold">{formatCurrency(paymentDetails.monthlyPayment)}</p>
                      <p className="text-sm text-gray-600">for {paymentDetails.term} months</p>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentOption?.type === 'rental' && paymentDetails.monthlyPayment && (
                <div className="mt-4 md:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Refundable Deposit:</h4>
                      <p className="text-blue-800 font-bold">{formatCurrency(paymentDetails.deposit)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Monthly Rental:</h4>
                      <p className="text-blue-800 font-bold text-xl">{formatCurrency(paymentDetails.monthlyPayment)}</p>
                      <p className="text-sm text-gray-600">{paymentDetails.term}-month contract</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-bold text-gray-800 mb-2">Notes:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>This quotation is valid for 30 days from the date of issue.</li>
            <li>Installation timeline: Approximately 3 days, weather permitting.</li>
            <li>Prices include all necessary materials and labor for installation.</li>
            {paymentOption?.type === 'one-off' && (
              <li>Payment terms: 50% deposit upon acceptance, 50% upon completion.</li>
            )}
            {paymentOption?.type === 'lease' && (
              <li>Lease terms: Initial deposit due upon signing, monthly payments begin 30 days after installation.</li>
            )}
            {paymentOption?.type === 'rental' && (
              <li>Rental terms: Deposit and first month payment due upon signing.</li>
            )}
            <li>Warranty covers defects and installation issues as per selected package.</li>
            {paymentOption?.type === 'rental' && (
              <li>Maintenance and support included throughout the rental period.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 