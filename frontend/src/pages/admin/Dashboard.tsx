import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect } from "react";
import { adminLogout } from "@/lib/adminAuth";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  totalDonations: number;
  totalTrees: number;
  totalRewards: number;
  recentDonations: {
    date: string;
    amount: number;
  }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  if (loading) {
    return <TreeLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
        />
        <StatCard
          title="Total Donations"
          value={stats?.totalDonations || 0}
          icon="💰"
          prefix="₹"
        />
        <StatCard
          title="Trees Planted"
          value={stats?.totalTrees || 0}
          icon="🌳"
        />
        <StatCard
          title="Rewards Issued"
          value={stats?.totalRewards || 0}
          icon="🎁"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Donation Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.recentDonations || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {/* Add recent activity table or list here */}
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button onClick={() => {/* Export logic */}} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, prefix = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 rounded-lg bg-white shadow-lg"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    <p className="text-3xl font-bold text-primary">
      {prefix}
      {value.toLocaleString()}
    </p>
  </motion.div>
);

const TreeLoader = () => (
  <div className="flex items-center justify-center h-screen">
    {/* Add your tree growing animation here */}
    <div className="animate-pulse text-4xl">🌱</div>
  </div>
);

export default AdminDashboard;