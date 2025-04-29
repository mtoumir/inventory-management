"use client"

import React, { useState, useMemo, useCallback } from 'react';
import {
  WastedEntry,
  useGetShiftsQuery,
  useCreateShiftMutation,
  useDeleteShiftMutation,
  NewShift,
  Shift,
} from '@/state/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const defaultEntry: WastedEntry = {
  category: 'PRODUCTION',
  problem: 'MACHINE',
  Quantity: 0,
};

const ShiftPage = () => {
  const { data: shifts = [], isLoading, isError } = useGetShiftsQuery();
  const [createShift] = useCreateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState<NewShift>({
    shiftType: 'MORNING',
    date: '',
    technicien: '',
    wastedEntries: [defaultEntry],
  });

  const [filter, setFilter] = useState({
    shiftType: 'ALL',
    category: 'ALL',
    problem: 'ALL',
    startDate: '',
    endDate: '',
  });

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEntryChange = useCallback(
    (index: number, field: keyof WastedEntry, value: string | number) => {
      setForm((prev) => {
        const entries = prev.wastedEntries.map((entry, i) =>
          i === index ? { ...entry, [field]: value } : entry
        );
        return { ...prev, wastedEntries: entries };
      });
    },
    []
  );

  const addWastedEntry = useCallback(
    () =>
      setForm((prev) => ({
        ...prev,
        wastedEntries: [...prev.wastedEntries, defaultEntry],
      })),
    []
  );

  const removeWastedEntry = useCallback(
    (index: number) =>
      setForm((prev) => ({
        ...prev,
        wastedEntries: prev.wastedEntries.filter((_, i) => i !== index),
      })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return setFormError('Date is required.');
    const totalWasted = form.wastedEntries.reduce((sum, e) => sum + e.Quantity, 0);
    try {
      setFormError(null);
      await createShift({ ...form, totalWasted }).unwrap();
      setForm({ shiftType: 'MORNING', date: '', technicien: '', wastedEntries: [defaultEntry] });
    } catch (err) {
      console.error(err);
      setFormError('Failed to create shift.');
    }
  };

  const chartData = useMemo(() => {
    const problemMap: Record<string, number> = {};

    shifts.forEach((s) => {
      // Shift filter
      if (filter.shiftType !== 'ALL' && s.shiftType !== filter.shiftType) return;
      // Date range filter
      const shiftDate = new Date(s.date);
      if (filter.startDate && shiftDate < new Date(filter.startDate)) return;
      if (filter.endDate && shiftDate > new Date(filter.endDate)) return;

      s.wastedEntries.forEach((entry) => {
        // Category and problem filter must both match
        if (filter.category !== 'ALL' && entry.category !== filter.category) return;
        if (filter.problem !== 'ALL' && entry.problem !== filter.problem) return;

        problemMap[entry.problem] = (problemMap[entry.problem] || 0) + entry.Quantity;
      });
    });

    return Object.entries(problemMap).map(([name, wasted]) => ({ name, wasted }));
  }, [shifts, filter]);

  if (isError) return <p className="text-red-600">Error loading shifts.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Create Form */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Create New Shift</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              name="shiftType"
              value={form.shiftType}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option value="MORNING">Morning</option>
              <option value="MIDDAY">Midday</option>
              <option value="NIGHT">Night</option>
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="technicien"
              placeholder="Technician"
              value={form.technicien}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          </div>
          {form.wastedEntries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={entry.category}
                onChange={(e) => handleEntryChange(idx, 'category', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="PRODUCTION">Production</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                value={entry.problem}
                onChange={(e) => handleEntryChange(idx, 'problem', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="MACHINE">Machine</option>
                <option value="MATERIAL">Material</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="number"
                min="0"
                placeholder="Qty"
                value={entry.Quantity}
                onChange={(e) => handleEntryChange(idx, 'Quantity', Number(e.target.value))}
                className="p-2 border rounded w-20"
              />
              <button
                type="button"
                onClick={() => removeWastedEntry(idx)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWastedEntry}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Entry
          </button>
          {formError && <p className="text-red-600">{formError}</p>}
          <button
            type="submit"
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Submit Shift
          </button>
        </form>
      </section>

      {/* Graph Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Wasted Graph</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filter.shiftType}
            onChange={(e) => setFilter((f) => ({ ...f, shiftType: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Shifts</option>
            <option value="MORNING">Morning</option>
            <option value="MIDDAY">Midday</option>
            <option value="NIGHT">Night</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Categories</option>
            <option value="PRODUCTION">Production</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OTHER">Other</option>
          </select>
          <select
            value={filter.problem}
            onChange={(e) => setFilter((f) => ({ ...f, problem: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="ALL">All Problems</option>
            <option value="MACHINE">Machine</option>
            <option value="MATERIAL">Material</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter((f) => ({ ...f, startDate: e.target.value }))}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter((f) => ({ ...f, endDate: e.target.value }))}
            className="p-2 border rounded"
          />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wasted" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* All Shifts Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">All Shifts</h1>
        {isLoading ? (
          <p>Loading shifts...</p>
        ) : (
          <div className="space-y-4">
            {shifts.map((s: Shift) => (
              <div key={s.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {s.shiftType} | {formatDate(s.date)} | Tech: {s.technicien || '-'}
                    </p>
                    <p className="text-gray-700">
                      Total Wasted: <span className="font-bold">{s.totalWasted}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteShift(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <ul className="mt-2 ml-4 list-disc text-gray-700">
                  {s.wastedEntries.map((we, i) => (
                    <li key={i}>
                      {we.category} - {we.problem}: {we.Quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShiftPage;
