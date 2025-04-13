"use client";

import CardPopularMaterials from "./CardPopularMaterials";
import CardProductionsSummary from "./CardProductionsSummary";
import CardSortiesSummary from "./CardSortiesSummary";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularMaterials />
      <CardProductionsSummary />
      <CardSortiesSummary />
    </div>
  );
};

export default Dashboard;