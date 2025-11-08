export interface RewardsBalance {
  greenPoints: number;
  walletBalance: number;
}

export interface RewardsConfig {
  pointsPerTree: number;
  conversionRate: number; // How many ETB per point when converting to wallet
}

export interface RewardsTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  points: number;
  createdAt: string;
  description: string;
}