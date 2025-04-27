'use client';

import { useState } from 'react';
import { NewShift, useCreateShiftMutation, useGetShiftsQuery } from '@/state/api';

const WastedPerShift = () => {
  const { data: shifts = [], isLoading, refetch } = useGetShiftsQuery();
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();

  const [form, setForm] = useState<NewShift>({
    shift: undefined,
    category: '',
    problem: '',
    numbWasted: undefined,
    timeStamp: '',
  });

  const [date, setDate] = useState({
    day: '',
    month: '',
    year: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'numbWasted' || name === 'shift' ? Number(value) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build timestamp manually from selected year, month, day
    const { year, month, day } = date;
    const completeTimestamp = new Date(`${year}-${month}-${day}T00:00:00`).toISOString();

    try {
      await createShift({
        ...form,
        timeStamp: completeTimestamp,
      }).unwrap();
      setForm({ shift: undefined, category: '', problem: '', numbWasted: undefined, timeStamp: '' });
      setDate({ day: '', month: '', year: '' });
      refetch();
    } catch (error) {
      console.error('Failed to create shift:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Wasted Per Shift</h1>

      {/* Create Shift Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Shift</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Shift Number</label>
          <input
            type="number"
            name="shift"
            value={form.shift || ''}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter shift number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter category"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Problem</label>
          <input
            type="text"
            name="problem"
            value={form.problem}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter problem description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Number Wasted</label>
          <input
            type="number"
            name="numbWasted"
            value={form.numbWasted || ''}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Enter wasted quantity"
          />
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Select Date</label>
          <div className="flex gap-2">
            <select
              name="day"
              value={date.day}
              onChange={handleDateChange}
              className="p-2 border rounded w-1/3"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="month"
              value={date.month}
              onChange={handleDateChange}
              className="p-2 border rounded w-1/3"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="year"
              value={date.year}
              onChange={handleDateChange}
              className="p-2 border rounded w-1/3"
            >
              <option value="">Year</option>
              {Array.from({ length: 5 }, (_, i) => {
                const currentYear = new Date().getFullYear();
                return (
                  <option key={i} value={currentYear - i}>
                    {currentYear - i}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {isCreating ? 'Creating...' : 'Create Shift'}
        </button>
      </form>

      {/* Shifts List */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Existing Shifts</h2>
        {isLoading ? (
          <p>Loading shifts...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Shift</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Problem</th>
                  <th className="p-2 border">Number Wasted</th>
                  <th className="p-2 border">Time Stamp</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.defaultPerShiftId} className="hover:bg-gray-100">
                    <td className="p-2 border text-center">{shift.shift ?? '-'}</td>
                    <td className="p-2 border">{shift.category || '-'}</td>
                    <td className="p-2 border">{shift.problem || '-'}</td>
                    <td className="p-2 border text-center">{shift.numbWasted ?? '-'}</td>
                    <td className="p-2 border">{new Date(shift.timeStamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WastedPerShift;
