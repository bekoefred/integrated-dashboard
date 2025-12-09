import React, { Suspense } from "react";
import { StatCard } from "../Cards/StatCard";

const LazyStatCard = (props: any) => (
  <Suspense fallback={<div>Loading...</div>}>
    <StatCard {...props} />
  </Suspense>
);

export default LazyStatCard;
