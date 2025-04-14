'use client';

import { useState } from 'react';
import { useGetSortiesQuery, useCreateSortieMutation } from '@/state/api';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const Sorties = () => {
  const { data: sorties, isLoading, isError, refetch } = useGetSortiesQuery();
  const [createSortie, { isLoading: isCreating }] = useCreateSortieMutation();

  const [formData, setFormData] = useState({
    codeSAP: '',
    quantity: 1,
    userName: '',
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSortie({ ...formData }).unwrap();
      setFeedback({ type: 'success', message: 'Sortie ajoutée avec succès ✅' });
      setFormData({ codeSAP: '', quantity: 1, userName: '' });
      refetch();
    } catch (err: any) {
      console.error('Failed to create sortie:', err);
      setFeedback({ type: 'error', message: 'Erreur lors de l’ajout de la sortie ❌' });
    }
    setTimeout(() => setFeedback(null), 3000); // Auto-dismiss
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sorties</h1>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          } flex items-center gap-2`}
        >
          {feedback.type === 'success' ? <CheckCircle2 /> : <AlertTriangle />}
          {feedback.message}
        </div>
      )}

      {/* Create Sortie Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label htmlFor="codeSAP" className="block text-sm font-medium mb-1">
            Code SAP
          </label>
          <input
            type="text"
            name="codeSAP"
            id="codeSAP"
            value={formData.codeSAP}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantité
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            min={1}
            value={formData.quantity}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Ajout...
            </span>
          ) : (
            'Ajouter Sortie'
          )}
        </button>
      </form>

      {/* Loading / Error / Empty States */}
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" />
          Chargement des sorties...
        </div>
      )}
      {isError && <div className="text-red-500">Erreur lors du chargement des sorties.</div>}
      {sorties && sorties.length === 0 && <div className="text-gray-500">Aucune sortie trouvée.</div>}

      {/* Sorties Table */}
      {sorties && sorties.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">ID Sortie</th>
                <th className="px-6 py-3 font-semibold">Désignation</th>
                <th className="px-6 py-3 font-semibold">Code SAP</th>
                <th className="px-6 py-3 font-semibold">Quantité</th>
                <th className="px-6 py-3 font-semibold">Utilisateur</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorties.map((sortie) => (
                <tr key={sortie.sortieId}>
                  <td className="px-6 py-4">{sortie.sortieId || '—'}</td>
                  <td className="px-6 py-4">{sortie.material?.designation || '—'}</td>
                  <td className="px-6 py-4">{sortie.codeSAP}</td>
                  <td className="px-6 py-4">{sortie.quantity}</td>
                  <td className="px-6 py-4">{sortie.userName}</td>
                  <td className="px-6 py-4">
                    {new Date(sortie.timeStamp).toLocaleString('fr-FR')}
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

export default Sorties;
