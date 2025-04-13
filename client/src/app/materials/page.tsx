"use client";
import React, { useState } from "react";
import { useGetMaterialsQuery, useCreateMaterialMutation, useDeleteMaterialMutation, useUpdateMaterialMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, Pencil, Trash } from "lucide-react";
import Header from "../(components)/Header";
import CreateMaterialModal from "./CreateMaterialModal";

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

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<MaterialFormData | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MaterialFormData;
    direction: "asc" | "desc";
  } | null>(null);

  const { data: materials, isLoading, isError } = useGetMaterialsQuery(searchTerm);
  const [createMaterial] = useCreateMaterialMutation();
  const [deleteMaterial] = useDeleteMaterialMutation();
  const [updateMaterial] = useUpdateMaterialMutation();

  const handleCreateOrUpdateMaterial = async (materialData: MaterialFormData) => {
    if (editMaterial) {
      await updateMaterial(materialData);
    } else {
      await createMaterial(materialData);
    }
    setEditMaterial(null);
  };

  const handleSort = (key: keyof MaterialFormData) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleDelete = async (codeSAP: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      await deleteMaterial(codeSAP);
    }
  };

  const handleEdit = (material: MaterialFormData) => {
    setEditMaterial(material);
    setIsModalOpen(true);
  };

  const sortedMaterials = [...(materials || [])].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aVal = a[key] ?? "";
    const bVal = b[key] ?? "";

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    return direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError || !materials) return <div className="text-center text-red-500 py-4">Failed to fetch materials.</div>;

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Header name="materials" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setEditMaterial(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Add Material
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border border-gray-300 shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {[
                { key: "codeSAP", label: "Code SAP" },
                { key: "designation", label: "Designation" },
                { key: "unit", label: "Unit" },
                { key: "typeArticle", label: "Type" },
                { key: "PU", label: "PU" },
                { key: "quantity", label: "Quantity" },
                { key: "cout", label: "Cout" },
                { key: "imputation", label: "Imputation" },
                { key: "desImputation", label: "Designation Imputation" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof MaterialFormData)}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  {label}{" "}
                  {sortConfig?.key === key && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMaterials.map((material) => (
              <tr key={material.codeSAP}>
                <td className="px-4 py-2 text-sm text-gray-800">{material.codeSAP}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.designation}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.unit}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.typeArticle}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.PU?.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.quantity}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.cout?.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.imputation}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{material.desImputation}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(material)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(material.codeSAP)} className="text-red-600 hover:text-red-800">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateMaterialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditMaterial(null);
        }}
        onSubmit={handleCreateOrUpdateMaterial}
        initialData={editMaterial}
      />
    </div>
  );
};

export default Materials;
