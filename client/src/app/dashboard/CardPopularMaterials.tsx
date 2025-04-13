"use client"

import { useGetDashboardMetricsQuery } from "@/state/api"
import React from "react";


const CardPopularMaterials = () => {
    const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery()

    console.log("popularMaterials", dashboardMetrics?.popularMaterials);

      return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
          {isLoading ? (
            <div className="m-5">Loading...</div>
          ) : (
            <>
              <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                Most Using Materials
              </h3>
              <hr />
              <div className="overflow-auto h-full">
              {dashboardMetrics?.popularMaterials?.length === 0 ? (
              <div className="m-5 text-gray-500">No popular materials found.</div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3">Code SAP</th>
                    <th scope="col" className="px-6 py-3">Designation</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardMetrics?.popularMaterials?.map((material) => (
                    <tr key={material.codeSAP} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{material.codeSAP}</td>
                      <td className="px-6 py-4">{material.designation ?? "—"}</td>
                      <td className="px-6 py-4">
                        {material.quantity !== undefined ? material.quantity : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
              </div>
            </>
          )}
        </div>
      );

    
    };

export default CardPopularMaterials