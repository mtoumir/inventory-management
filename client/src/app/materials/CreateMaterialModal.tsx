import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Header from '../(components)/Header';

type MaterialFormData = {
  codeSAP: string;
  designation?: string;
  unit?: string;
  typeArticle?: string;
  PU?: number;
  quantity?: number;
  cout?: number;
  imputation?: string;
  desImputation?: string;
};

type MaterialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MaterialFormData) => void;
  initialData?: MaterialFormData | null;
  existingCodeSAPs?: string[];
};

const MaterialModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingCodeSAPs = [],
}: MaterialModalProps) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    codeSAP: '',
    designation: '',
    unit: '',
    typeArticle: '',
    PU: undefined,
    quantity: undefined,
    cout: undefined,
    imputation: '',
    desImputation: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        codeSAP: '',
        designation: '',
        unit: '',
        typeArticle: '',
        PU: undefined,
        quantity: undefined,
        cout: undefined,
        imputation: '',
        desImputation: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['PU', 'quantity', 'cout'].includes(name) ? parseFloat(value) : value,
    }));
    setError(null); // Reset the error when a change is made
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Debugging log to check existingCodeSAPs
    console.log(existingCodeSAPs);

    // Check if codeSAP already exists
    if (existingCodeSAPs.includes(formData.codeSAP)) {
      setError('Material CodeSAP already exists');
      return; // Prevent form submission if there's an error
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = 'block text-sm font-medium text-gray-700';
  const inputCssStyles = 'block w-full mb-2 p-2 border-gray-500 border-2 rounded-md';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={initialData ? 'Update Material' : 'Create New Product'} />
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-5">
          {[
            { name: 'codeSAP', label: 'Material CodeSAP', required: true },
            { name: 'designation', label: 'Designation' },
            { name: 'unit', label: 'Unit', type: 'select', options: ['1 PCE', '1 L'] }, // Unit select field
            { name: 'typeArticle', label: 'Type Article', type: 'select', options: ['STRA', 'HIBE', 'VERP'] }, // Type Article select field
            { name: 'PU', label: 'Price Unit (PU)', type: 'number' },
            { name: 'quantity', label: 'Material Quantity', type: 'number', required: true },
            { name: 'cout', label: 'Cost', type: 'number' },
            { name: 'imputation', label: 'Imputation' },
            { name: 'desImputation', label: 'Designation Imputation', type: 'select', options: ['Postglass PGS3', 'Postglass PGS4', 'POSTGLASS KENITRA 3'] }, // Imputation select field
          ].map(({ name, label, type = 'text', required, options }) => (
            <div key={name}>
              <label htmlFor={name} className={labelCssStyles}>
                {label}
              </label>
              {type === 'select' ? (
                <select
                  name={name}
                  onChange={handleChange}
                  value={formData[name as keyof MaterialFormData] || ''}
                  className={inputCssStyles}
                  required={required}
                >
                  {options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  placeholder={label}
                  onChange={handleChange}
                  value={formData[name as keyof MaterialFormData] || ''}
                  className={inputCssStyles}
                  required={required}
                />
              )}
            </div>
          ))}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
