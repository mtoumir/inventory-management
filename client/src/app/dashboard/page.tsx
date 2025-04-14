"use client";

import React, { useEffect, useState } from "react";
import { useGetMaterialsQuery, useGetSortiesQuery, useGetProductionsQuery } from "@/state/api";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  ChartData,
} from "chart.js";
import { parse } from "json2csv"; // Import json2csv for CSV export

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard = () => {
  const { data: materials, isLoading: materialsLoading } = useGetMaterialsQuery("");
  const { data: sorties, isLoading: sortiesLoading } = useGetSortiesQuery();
  const { data: productions, isLoading: productionsLoading } = useGetProductionsQuery();

  const [filter, setFilter] = useState("daily"); // Filter state (daily, weekly, monthly)
  const [productionData, setProductionData] = useState<ChartData<"pie"> | null>(null);
  const [materialDistributionData, setMaterialDistributionData] = useState<ChartData<"bar"> | null>(null);
  const [productionTrendData, setProductionTrendData] = useState<ChartData<"line"> | null>(null);

  const filterDataByTimeFrame = (data: any[], timeFrame: string) => {
    return data.filter((item) => {
      const date = new Date(item.timeStamp);
      const now = new Date();

      switch (timeFrame) {
        case "daily":
          return date.toDateString() === now.toDateString(); // Filter by today
        case "weekly":
          const startOfWeek = now.setDate(now.getDate() - now.getDay()); // Start of this week
          return date >= new Date(startOfWeek);
        case "monthly":
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); // Filter by current month
        default:
          return true;
      }
    });
  };

  const exportToCSV = (data: any[], filename: string) => {
    try {
      const csv = parse(data); // Convert JSON data to CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Create download link and trigger download
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.click();
      }
    } catch (error) {
      console.error("Error exporting to CSV", error);
    }
  };

  // Add logic for data processing and chart updates
  useEffect(() => {
    if (productions?.length) {
      const filteredProductions = filterDataByTimeFrame(productions, filter);

      const productionQty = filteredProductions.reduce((acc, prod) => acc + (prod.quantity || 0), 0);
      const wasteQty = filteredProductions.reduce((acc, prod) => acc + (prod.wasteQuantity || 0), 0);

      setProductionData({
        labels: ['Production', 'Waste'],
        datasets: [
          {
            data: [productionQty, wasteQty],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });

      const trendLabels = filteredProductions.map((prod) =>
        new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(prod.timeStamp))
      );
      const trendData = filteredProductions.map((prod) => prod.quantity || 0);

      setProductionTrendData({
        labels: trendLabels,
        datasets: [
          {
            label: 'Production Quantity Over Time',
            data: trendData,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      });
    }

    if (sorties?.length && productions?.length) {
      const filteredSorties = filterDataByTimeFrame(sorties, filter);

      const labels = filteredSorties.map((s) => `CodeSAP ${s.codeSAP}`);
      const sortieQuantities = filteredSorties.map((s) => s.quantity ?? 0);

      const producedQuantities = filteredSorties.map((s) => {
        const relatedProductions = productions.filter(
          (p) => p.sortieId === s.sortieId && filterDataByTimeFrame([p], filter).length
        );
        return relatedProductions.reduce((sum, p) => sum + (p.quantity || 0), 0);
      });

      const wastedQuantities = filteredSorties.map((s) => {
        const relatedProductions = productions.filter(
          (p) => p.sortieId === s.sortieId && filterDataByTimeFrame([p], filter).length
        );
        return relatedProductions.reduce((sum, p) => sum + (p.wasteQuantity || 0), 0);
      });

      setMaterialDistributionData({
        labels,
        datasets: [
          {
            label: 'Sortie Quantity',
            data: sortieQuantities,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'Produced',
            data: producedQuantities,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Wasted',
            data: wastedQuantities,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [productions, sorties, filter]);

  if (materialsLoading || sortiesLoading || productionsLoading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`p-2 ${filter === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("daily")}
        >
          Daily
        </button>
        <button
          className={`p-2 ${filter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("weekly")}
        >
          Weekly
        </button>
        <button
          className={`p-2 ${filter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* CSV Export Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="p-2 bg-green-500 text-white"
          onClick={() => exportToCSV(materials ?? [], "materials.csv")}
        >
          Export Materials
        </button>
        <button
          className="p-2 bg-green-500 text-white"
          onClick={() => exportToCSV(productions ?? [], "productions.csv")}
        >
          Export Productions
        </button>
        <button
          className="p-2 bg-green-500 text-white"
          onClick={() => exportToCSV(sorties ?? [], "sorties.csv")}
        >
          Export Sorties
        </button>
      </div>

      {/* Your existing dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {/* KPI: Total Materials */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Sortie Details</h3>
          {sorties?.length ? (
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Sortie ID</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">codeSAP</th>
                </tr>
              </thead>
              <tbody>
                {sorties.map((sortie) => (
                  <tr key={sortie.sortieId} className="border-b">
                    <td className="px-4 py-2">{sortie.sortieId}</td>
                    <td className="px-4 py-2">{sortie.quantity}</td>
                    <td className="px-4 py-2">{sortie.userName}</td>
                    <td className="px-4 py-2">{sortie.codeSAP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sorties data available</p>
          )}
        </div>

        {/* Pie Chart: Production vs Waste */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Production vs Waste</h3>
          {productionData ? (
            <Pie
              data={productionData}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          ) : (
            <p>No production data available</p>
          )}
        </div>

        {/* Bar Chart: Sortie Quantities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Production Trend Over Time</h3>
          {productionTrendData ? (
            <Line
              data={productionTrendData}
              options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
            />
          ) : (
            <p>No trend data available</p>
          )}
        </div>

        {/* Line Chart: Production Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 xl:col-span-3">
          <h3 className="text-xl font-semibold mb-4">Sortie Quantities</h3>
          {materialDistributionData ? (
            <Bar
              data={materialDistributionData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <p>No sortie data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
