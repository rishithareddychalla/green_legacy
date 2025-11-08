export interface Donor {
  id: string;
  name: string;
  greenPoints: number;
  treesPlanted: number;
  donationAmount: number;
  email?: string;
}

export type BadgeType = 'bronze' | 'silver' | 'gold' | 'earth-guardian';

export interface DonorWithBadge extends Donor {
  badge: BadgeType;
  rank: number;
}

export const getBadgeType = (points: number): BadgeType => {
  if (points >= 10000) return 'earth-guardian';
  if (points >= 5000) return 'gold';
  if (points >= 1000) return 'silver';
  return 'bronze';
};

export const getBadgeEmoji = (badge: BadgeType): string => {
  switch (badge) {
    case 'earth-guardian':
      return '🌏';
    case 'gold':
      return '🌲';
    case 'silver':
      return '🌳';
    case 'bronze':
      return '🌿';
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};