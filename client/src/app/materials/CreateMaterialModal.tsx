import React, { ChangeEvent, FormEvent, useState } from 'react';
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

type CreateMaterialModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: MaterialFormData) => void;
};

const CreateMaterialModal = ({ isOpen, onClose, onCreate }: CreateMaterialModalProps) => {
    const [formData, setFormData] = useState({
        codeSAP: '',
        designation: '',
        unit: '',
        typeArticle: '',
        PU: undefined,
        quantity: undefined,
        cout: undefined,
        imputation: '',
        desImputation: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: 
                name === 'PU' || name === 'quantity' || name === 'cout' ? parseFloat(value) : value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e. preventDefault();
        onCreate(formData);
        onClose(); 
    }

    if (!isOpen) return null;

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
      "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <Header name="Create New Product" />
            <form onSubmit={handleSubmit} className="mt-5">
              <label htmlFor="materialCodeSAP" className={labelCssStyles}>
                Material CodeSAP
              </label>
              <input
                type="text"
                name="codeSAP"
                placeholder="Material CodeSAP"
                onChange={handleChange}
                value={formData.codeSAP}
                className={inputCssStyles}
                required
              />
      
              <label htmlFor="designation" className={labelCssStyles}>
                Designation
              </label>
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
                value={formData.designation}
                className={inputCssStyles}
              />
      
              <label htmlFor="unit" className={labelCssStyles}>
                Unit
              </label>
              <input
                type="text"
                name="unit"
                placeholder="Unit"
                onChange={handleChange}
                value={formData.unit}
                className={inputCssStyles}
              />
      
              <label htmlFor="typeArticle" className={labelCssStyles}>
                Type Article
              </label>
              <input
                type="text"
                name="typeArticle"
                placeholder="Type Article"
                onChange={handleChange}
                value={formData.typeArticle}
                className={inputCssStyles}
              />
      
              <label htmlFor="PU" className={labelCssStyles}>
                Price Unit (PU)
              </label>
              <input
                type="number"
                name="PU"
                placeholder="Price Unit"
                onChange={handleChange}
                value={formData.PU ?? ''}
                className={inputCssStyles}
              />
      
              <label htmlFor="materialQuantity" className={labelCssStyles}>
                Material Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                onChange={handleChange}
                value={formData.quantity ?? ''}
                className={inputCssStyles}
                required
              />
      
              <label htmlFor="cout" className={labelCssStyles}>
                Cost
              </label>
              <input
                type="number"
                name="cout"
                placeholder="Cost"
                onChange={handleChange}
                value={formData.cout ?? ''}
                className={inputCssStyles}
              />
      
              <label htmlFor="imputation" className={labelCssStyles}>
                Imputation
              </label>
              <input
                type="text"
                name="imputation"
                placeholder="Imputation"
                onChange={handleChange}
                value={formData.imputation}
                className={inputCssStyles}
              />
      
              <label htmlFor="desImputation" className={labelCssStyles}>
                Designation Imputation
              </label>
              <input
                type="text"
                name="desImputation"
                placeholder="Designation Imputation"
                onChange={handleChange}
                value={formData.desImputation}
                className={inputCssStyles}
              />
      
              {/* CREATE ACTIONS */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
      
    
}

export default CreateMaterialModal;

