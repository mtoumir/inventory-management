'use client';

import { useState, useEffect } from 'react';
import {
  useGetProductionsQuery,
  useCreateProductionMutation,
  useUpdateProductionMutation,
  Production,
  useDeleteProductionMutation
} from '@/state/api';

import { useGetSortiesQuery } from '@/state/api';  // Assuming this is the correct import for getting sorties
import { Loader2 } from 'lucide-react';

const Productions = () => {
  const { data: productions, isLoading, isError, refetch } = useGetProductionsQuery();
  const { data: sorties, isLoading: isSortiesLoading } = useGetSortiesQuery();  // Assuming this fetches the 'sortie' data
  const [createProduction, { isLoading: isCreating }] = useCreateProductionMutation();
  const [updateProduction, { isLoading: isUpdating }] = useUpdateProductionMutation();
  const [deleteProduction, { isLoading: isDeleting }] = useDeleteProductionMutation(); 

  const [formData, setFormData] = useState({
    productionId: '',
    sortieId: '',
    quantity: 0,
    wasteQuantity: 0,
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setFormData({ productionId: '', sortieId: '', quantity: 0, wasteQuantity: 0 });
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'wasteQuantity' ? Number(value) : value,
    }));
  };

    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
      null
    );

  const handleDelete = async ( id : string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette sortie ?')) return;
    try {
      await deleteProduction(id).unwrap();
      setFeedback({ type: 'success', message: 'Sortie supprimée avec succès ✅' });
      refetch();
    } catch (err: any) {
      console.error('Failed to delete sortie:', err);
      setFeedback({ type: 'error', message: 'Erreur lors de la suppression de la sortie ❌' });
    }
    setTimeout(() => setFeedback(null), 3000);
  }; 

  // Function to get the initial quantity from the sortie data
  const getSortieQuantity = (sortieId: string) => {
    const sortie = sorties?.find((sortie) => sortie.sortieId === sortieId);
    return sortie ? sortie.quantity : 0;  // Default to 0 if no matching sortie
  };

  const validateQuantities = () => {
    const initialQuantity = getSortieQuantity(formData.sortieId);
    if (formData.quantity > initialQuantity || formData.wasteQuantity > initialQuantity) {
      setError('Quantity and waste quantity cannot exceed the initial quantity of the sortie.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuantities()) return;

    try {
      if (editing) {
        await updateProduction(formData).unwrap();
      } else {
        await createProduction(formData).unwrap();
      }
      setEditing(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to save production:', err);
    }
  };

  const handleEdit = (production: Production) => {
    setFormData({
      productionId: production.productionId,
      sortieId: production.sortieId,
      quantity: production.quantity ?? 0,
      wasteQuantity: production.wasteQuantity ?? 0,
    });
    setEditing(true);
  };

  if (isLoading || isSortiesLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
        Loading productions...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productions</h1>
      <p className="text-gray-600 mb-6">
        This page allows you to manage productions. You can view, create, and edit productions.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <input
          type="text"
          name="sortieId"
          placeholder="Sortie ID"
          value={formData.sortieId}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          min={1}
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="wasteQuantity"
          min={0}
          placeholder="Waste Quantity"
          value={formData.wasteQuantity}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating || isUpdating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              {editing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            editing ? 'Update Production' : 'Create Production'
          )}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isError && <div className="text-red-500">Failed to load productions.</div>}
      {productions && productions.length === 0 && <div className="text-gray-500">No productions found.</div>}

      {/* Productions Table */}
      {productions && productions.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Production ID</th>
                <th className="px-6 py-3 font-semibold">Sortie ID</th>
                <th className="px-6 py-3 font-semibold">Initial Quantity</th> {/* Added column */}
                <th className="px-6 py-3 font-semibold">Quantity</th>
                <th className="px-6 py-3 font-semibold">Waste</th>
                <th className="px-6 py-3 font-semibold">Timestamp</th>
                <th className="px-6 py-3 font-semibold">update</th>
                <th className="px-6 py-3 font-semibold">delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productions.map((production) => (
                <tr key={production.productionId}>
                  <td className="px-6 py-4">{production.productionId}</td>
                  <td className="px-6 py-4">{production.sortieId}</td>
                  <td className="px-6 py-4">{getSortieQuantity(production.sortieId)}</td> {/* Displaying initial quantity */}
                  <td className="px-6 py-4">{production.quantity}</td>
                  <td className="px-6 py-4">{production.wasteQuantity}</td>
                  <td className="px-6 py-4">
                    {new Date(production.timeStamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(production)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td> 
                  <td className='px-6 py-4'>             
                  <button
                      onClick={() => handleDelete(production.productionId)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        'Supprimer'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Productions;
