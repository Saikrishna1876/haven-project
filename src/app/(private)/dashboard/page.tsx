"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);
  console.log(user);
  return <div>Dashboard Home</div>;
}

export default Dashboard;
