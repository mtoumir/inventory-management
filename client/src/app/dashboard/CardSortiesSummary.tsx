"use client"

import React from 'react'
import { useGetDashboardMetricsQuery } from "@/state/api"
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
const CardSortiesSummary = () => {
    const { data, isLoading, isError } = useGetDashboardMetricsQuery()
    const sortiesData = data?.sortiesSummary || [];
    const [timeframe, setTimeframe] = useState("weekly");
    const totalQuantitySum = sortiesData.reduce((acc, curr) => acc + (curr.sortieTotalQuantity ?? 0), 0);
    const averageChangePercentage = sortiesData.reduce((acc, curr, _, array) => {
        return acc + curr.sortieChangePercentage! / array.length;
    }, 0) || 0;
    const highestValueData = sortiesData.reduce((acc, curr) => {
      const accValue = acc?.sortieTotalQuantity ?? 0;
      const currValue = curr?.sortieTotalQuantity ?? 0;
      return accValue > currValue ? acc : curr;
    }, sortiesData[0] || {});
    
    const highestValueDate = highestValueData.date ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
    }) : "N/A";

    if(isError) {
        return <div className="m-5">Failed to fetch data</div>;
    }

    return(
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
        {isLoading ? (
          <div className="m-5">Loading...</div>
        ) : (
          <>
            {/* HEADER */}
            <div>
              <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                Sortie Summary
              </h2>
              <hr />
            </div>
  
            {/* BODY */}
            <div>
              {/* BODY HEADER */}
              <div className="flex justify-between items-center mb-6 px-7 mt-5">
                <div className="text-lg font-medium">
                  <p className="text-xs text-gray-400">Value</p>
                  <span className="text-2xl font-extrabold">
                    $
                    {(totalQuantitySum / 1000000).toLocaleString("en", {
                      maximumFractionDigits: 2,
                    })}
                    m
                  </span>
                  <span className="text-green-500 text-sm ml-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    {averageChangePercentage.toFixed(2)}%
                  </span>
                </div>
                <select
                  className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                  value={timeframe}
                  onChange={(e) => {
                    setTimeframe(e.target.value);
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {/* CHART */}
              <ResponsiveContainer width="100%" height={350} className="px-7">
                <BarChart
                  data={sortiesData}
                  margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => {
                      return `$${(value / 1000000).toFixed(0)}m`;
                    }}
                    tick={{ fontSize: 12, dx: -1 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString("en")}`,
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                  />
                  <Bar
                    dataKey="totalValue"
                    fill="#3182ce"
                    barSize={10}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* FOOTER */}
            <div>
              <hr />
              <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
                <p>{sortiesData.length || 0} days</p>
                <p className="text-sm">
                  Highest Sales Date:{" "}
                  <span className="font-bold">{highestValueDate}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    )
}

export default CardSortiesSummary;