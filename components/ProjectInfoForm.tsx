import { JSX } from "preact";
import { ProjectInfo } from "../data/products.ts";

interface ProjectInfoFormProps {
  projectInfo: ProjectInfo;
  onChange: (info: ProjectInfo) => void;
  errors: Partial<Record<keyof ProjectInfo, string>>;
  disabled?: boolean;
}

export default function ProjectInfoForm({
  projectInfo,
  onChange,
  errors,
  disabled = false
}: ProjectInfoFormProps): JSX.Element {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    
    onChange({
      ...projectInfo,
      [name]: value
    });
  };
  
  const handleDateChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    
    onChange({
      ...projectInfo,
      [name]: value ? new Date(value) : undefined
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 bg-blue-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">Project Information</h2>
        <p className="text-gray-600 text-sm mt-1">Tell us about your project</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectInfo.name}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : ''}`}
              disabled={disabled}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Installation Location*
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={projectInfo.location}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-300' : ''}`}
              disabled={disabled}
              required
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person*
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={projectInfo.contactName}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contactName ? 'border-red-300' : ''}`}
              disabled={disabled}
              required
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone*
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={projectInfo.contactPhone}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contactPhone ? 'border-red-300' : ''}`}
              disabled={disabled}
              required
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email*
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={projectInfo.contactEmail}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contactEmail ? 'border-red-300' : ''}`}
              disabled={disabled}
              required
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Installation Date
            </label>
            <input
              type="date"
              id="installationDate"
              name="installationDate"
              value={projectInfo.installationDate ? new Date(projectInfo.installationDate.getTime() - (projectInfo.installationDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={disabled}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={projectInfo.notes}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
} 