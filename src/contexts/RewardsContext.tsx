import { createContext, useContext, useState, useEffect } from 'react';
import { RewardsBalance, RewardsConfig, RewardsTransaction } from '@/types/rewards';
import { toast } from 'sonner';
import { getToken } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

interface RewardsContextType {
  balance: RewardsBalance;
  transactions: RewardsTransaction[];
  isLoading: boolean;
  redeemPoints: (points: number) => Promise<void>;
  addPoints: (points: number, description: string) => Promise<void>;
  config: RewardsConfig;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

const DEFAULT_CONFIG: RewardsConfig = {
  pointsPerTree: 10,
  conversionRate: 1, // 1 point = 1 ETB
};

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<RewardsBalance>({ greenPoints: 0, walletBalance: 0 });
  const [transactions, setTransactions] = useState<RewardsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [config] = useState<RewardsConfig>(DEFAULT_CONFIG);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get userId from token or localStorage (adjust as needed)
    const token = getToken();
    if (token) {
      // Example: decode token to get userId, or fetch profile
      // For now, assume userId is stored in localStorage
      setUserId(localStorage.getItem('user_id'));
    }
  }, []);
  useEffect(() => {
    if (userId) {
      fetchBalance();
      fetchTransactions();
    }
  }, [userId]);

  async function fetchBalance() {
    if (!userId) return;
    try {
      const res = await fetchWithAuth(`/api/rewards/balance?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch balance');
      const data = await res.json();
      setBalance({
        greenPoints: data.greenPoints,
        walletBalance: data.walletBalance,
      });
    } catch (error) {
      console.error('Error fetching rewards balance:', error);
      toast.error('Failed to fetch rewards balance');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTransactions() {
    if (!userId) return;
    try {
      const res = await fetchWithAuth(`/api/rewards/transactions?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching rewards transactions:', error);
      toast.error('Failed to fetch rewards history');
    }
  }

  async function addPoints(points: number, description: string) {
    if (!userId) return;
    try {
      const res = await fetchWithAuth(`/api/rewards/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points, description }),
      });
      if (!res.ok) throw new Error('Failed to add points');
      await fetchBalance();
      await fetchTransactions();
      toast.success(`Earned ${points} Green Points!`);
    } catch (error) {
      console.error('Error adding points:', error);
      toast.error('Failed to add points');
    }
  }

  async function redeemPoints(points: number) {
    if (!userId || points > balance.greenPoints) {
      toast.error('Insufficient points balance');
      return;
    }
    try {
      const res = await fetchWithAuth(`/api/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points }),
      });
      if (!res.ok) throw new Error('Failed to redeem points');
      await fetchBalance();
      await fetchTransactions();
      toast.success('Successfully converted points to wallet balance');
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error('Failed to redeem points');
    }
  }

  return (
    <RewardsContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        redeemPoints,
        addPoints,
        config,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}