'use client';

import { useState, useEffect } from 'react';
import {
  useGetProductionsQuery,
  useCreateProductionMutation,
  useUpdateProductionMutation,
  useDeleteProductionMutation,
  Production
} from '@/state/api';
import { useGetSortiesQuery } from '@/state/api';
import { Loader2 } from 'lucide-react';

const Productions = () => {
  const { data: productions, isLoading, isError, refetch } = useGetProductionsQuery();
  const { data: sorties, isLoading: isSortiesLoading } = useGetSortiesQuery();
  const [createProduction, { isLoading: isCreating }] = useCreateProductionMutation();
  const [updateProduction, { isLoading: isUpdating }] = useUpdateProductionMutation();
  const [deleteProduction, { isLoading: isDeleting }] = useDeleteProductionMutation();

  const [formData, setFormData] = useState({
    productionId: '',
    sortieId: '',
    quantity: 0,
    wasteQuantity: 0,
    statusType: 'ONPRODUCTION' as 'CLOSED' | 'ONPRODUCTION',
    timeStamp: new Date().toISOString()
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!editing) {
      setFormData({
        productionId: '',
        sortieId: '',
        quantity: 0,
        wasteQuantity: 0,
        statusType: 'ONPRODUCTION',
        timeStamp: new Date().toISOString()
      });
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'wasteQuantity' ? Number(value) : value
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette production ?')) return;
    try {
      await deleteProduction(id).unwrap();
      setFeedback({ type: 'success', message: 'Production supprimée avec succès ✅' });
      refetch();
    } catch (err) {
      console.error('Failed to delete production:', err);
      setFeedback({ type: 'error', message: 'Erreur lors de la suppression ❌' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const getSortieQuantity = (sortieId: string) => {
    const sortie = sorties?.find((s) => s.sortieId === sortieId);
    return sortie ? sortie.quantity : 0;
  };

  const validateQuantities = () => {
    const sortieId = formData.sortieId;
    const initialQuantity = getSortieQuantity(sortieId);

    const totalUsed =
      productions
        ?.filter((p) => p.sortieId === sortieId && (!editing || p.productionId !== formData.productionId))
        .reduce((sum, p) => sum + (p.quantity ?? 0) + (p.wasteQuantity ?? 0), 0) || 0;

    const currentTotal = formData.quantity + formData.wasteQuantity;
    const available = initialQuantity - totalUsed;

    if (currentTotal > available) {
      setError(
        `La quantité totale saisie (${currentTotal}) dépasse la quantité disponible (${available}) pour cette sortie.`
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuantities()) return;

    try {
      const dataToSubmit = {
        ...formData,
        timeStamp: editing ? formData.timeStamp : new Date().toISOString()
      };

      if (editing) {
        await updateProduction(dataToSubmit).unwrap();
      } else {
        await createProduction(dataToSubmit).unwrap();
      }

      setEditing(false);
      refetch();
    } catch (err) {
      console.error('Failed to save production:', err);
    }
  };

  const handleEdit = (production: Production) => {
    setFormData({
      productionId: production.productionId,
      sortieId: production.sortieId,
      quantity: production.quantity ?? 0,
      wasteQuantity: production.wasteQuantity ?? 0,
      statusType: production.statusType,
      timeStamp: production.timeStamp
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
        Cette page permet de gérer les productions. Vous pouvez créer, éditer ou supprimer une production.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
          ) : editing ? 'Update Production' : 'Create Production'}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isError && <div className="text-red-500">Erreur lors du chargement des productions.</div>}
      {productions && productions.length === 0 && <div className="text-gray-500">Aucune production trouvée.</div>}

      {productions && productions.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Production ID</th>
                <th className="px-6 py-3 font-semibold">Sortie ID</th>
                <th className="px-6 py-3 font-semibold">Initial Quantity</th>
                <th className="px-6 py-3 font-semibold">Quantity</th>
                <th className="px-6 py-3 font-semibold">Waste</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Timestamp</th>
                <th className="px-6 py-3 font-semibold">Update</th>
                <th className="px-6 py-3 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productions.map((production) => (
                <tr key={production.productionId}>
                  <td className="px-6 py-4">{production.productionId}</td>
                  <td className="px-6 py-4">{production.sortieId}</td>
                  <td className="px-6 py-4">{getSortieQuantity(production.sortieId)}</td>
                  <td className="px-6 py-4">{production.quantity}</td>
                  <td className="px-6 py-4">{production.wasteQuantity}</td>
                  <td className="px-6 py-4">{production.statusType}</td>
                  <td className="px-6 py-4">{new Date(production.timeStamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(production)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(production.productionId)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Supprimer'}
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
