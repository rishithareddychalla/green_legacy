import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/adminApi';
import {
  Users,
  TreePine,
  Trophy,
  DollarSign,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalTrees: 0,
    totalRewards: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await adminApi.getOverviewStats();
        setStats({
          totalUsers: stats.totalUsers,
          totalDonations: stats.totalDonations,
          totalTrees: stats.totalTrees,
          totalRewards: stats.totalTrees * 10, // 10 points per tree
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users on the platform"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Total Donations"
            value={`$${(stats.totalDonations ?? 0).toLocaleString()}`}
            icon={DollarSign}
            description="Total amount donated"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard
            title="Trees Planted"
            value={(stats.totalTrees ?? 0).toLocaleString()}
            icon={TreePine}
            description="Total trees funded through donations"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatsCard
            title="Green Points"
            value={(stats.totalRewards ?? 0).toLocaleString()}
            icon={Trophy}
            description="Total rewards points issued"
          />
        </motion.div>
      </div>
    </div>
  );
}