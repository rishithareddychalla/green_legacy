import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import type { DonorWithBadge } from "../../types/donor";
import { getBadgeEmoji, formatNumber } from "../../types/donor";
import { Card } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface DonorLeaderboardProps {
  donors: DonorWithBadge[];
  className?: string;
}

const DonorCard = ({ donor, delay }: { donor: DonorWithBadge; delay: number }) => {
  const isTop3 = donor.rank <= 3;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <Card className={`p-4 ${isTop3 ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isTop3 ? 'bg-primary text-white' : 'bg-muted'
          }`}>
            {donor.rank}
          </div>
          <Avatar className="w-10 h-10">
            <span className="font-semibold text-lg">
              {donor.name.charAt(0).toUpperCase()}
            </span>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{donor.name}</span>
              <span className="text-xl" role="img" aria-label={`${donor.badge} badge`}>
                {getBadgeEmoji(donor.badge)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatNumber(donor.greenPoints)} Green Points • {formatNumber(donor.treesPlanted)} Trees
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">₹{formatNumber(donor.donationAmount)}</div>
            <div className="text-xs text-muted-foreground">Donated</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DonorTableRow = ({ donor }: { donor: DonorWithBadge }) => {
  const isTop3 = donor.rank <= 3;
  
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${isTop3 ? 'bg-primary/5' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
            isTop3 ? 'bg-primary text-white' : 'bg-muted'
          } text-sm`}>
            {donor.rank}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <span className="text-sm font-semibold">
              {donor.name.charAt(0).toUpperCase()}
            </span>
          </Avatar>
          <span className="font-semibold">{donor.name}</span>
          <span className="text-xl" role="img" aria-label={`${donor.badge} badge`}>
            {getBadgeEmoji(donor.badge)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">{formatNumber(donor.greenPoints)}</td>
      <td className="px-4 py-3">{formatNumber(donor.treesPlanted)}</td>
      <td className="px-4 py-3">₹{formatNumber(donor.donationAmount)}</td>
    </motion.tr>
  );
};

export const DonorLeaderboard = ({ donors, className = '' }: DonorLeaderboardProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className={`py-12 ${className}`}>
      <div className="container px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">
            🌟 Top Donors of Green Legacy
          </h2>
          <p className="text-muted-foreground">
            These champions are growing forests with us!
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {isMobile ? (
            <div className="space-y-4">
              {donors.map((donor, index) => (
                <DonorCard 
                  key={donor.id} 
                  donor={donor} 
                  delay={index} 
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left w-16">Rank</th>
                      <th className="px-4 py-3 text-left">Donor</th>
                      <th className="px-4 py-3 text-left">Green Points</th>
                      <th className="px-4 py-3 text-left">Trees Planted</th>
                      <th className="px-4 py-3 text-left">Amount Donated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <DonorTableRow key={donor.id} donor={donor} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/rewards">
                View Full Leaderboard →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};