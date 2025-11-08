import { useRewards } from "@/contexts/RewardsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wallet, Gift, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Rewards() {
  const { balance, transactions, isLoading, redeemPoints, config } = useRewards();
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleRedeem = async () => {
    const points = parseInt(pointsToRedeem);
    if (isNaN(points) || points <= 0) {
      toast.error("Please enter a valid number of points");
      return;
    }
    if (points > balance.greenPoints) {
      toast.error("Insufficient points balance");
      return;
    }
    setRedeeming(true);
    await redeemPoints(points);
    setRedeeming(false);
    setPointsToRedeem("");
  };

  const presetAmounts = [100, 500, 1000];

  return (
    <div className="container mx-auto py-8 px-4">
      <AnimatePresence>
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg text-primary">Loading rewards...</p>
            </div>
          </div>
        ) : (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="text-green-500 animate-bounce" /> My Rewards
            </h1>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Balances Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-gradient-to-br from-green-50 to-primary/5 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="text-green-500" />
                    <h2 className="font-heading text-2xl font-semibold">Green Points</h2>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-5xl font-bold text-primary mb-2"
                  >
                    {balance.greenPoints}
                  </motion.div>
                  <p className="text-muted-foreground">Points earned from tree donations</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/5 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="text-blue-600" />
                    <h2 className="font-heading text-2xl font-semibold">Wallet Balance</h2>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-5xl font-bold text-blue-600 mb-2"
                  >
                    ETB {balance.walletBalance}
                  </motion.div>
                  <p className="text-muted-foreground">Available balance for future donations</p>
                </Card>
              </motion.div>
              {/* Redeem Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 shadow-lg">
                  <h2 className="font-heading text-2xl font-semibold mb-4">Redeem Points</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Quick Select</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {presetAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={pointsToRedeem === amount.toString() ? "default" : "outline"}
                            onClick={() => setPointsToRedeem(amount.toString())}
                            className={pointsToRedeem === amount.toString() ? "bg-green-500 text-white" : ""}
                          >
                            {amount} Points
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Amount</Label>
                      <Input
                        type="number"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(e.target.value)}
                        placeholder="Enter points to redeem"
                        min="0"
                        max={balance.greenPoints}
                        className="focus:ring-green-500"
                      />
                      <p className="text-sm text-muted-foreground">
                        Conversion rate: {config.conversionRate} ETB per point
                      </p>
                      {pointsToRedeem && !isNaN(parseInt(pointsToRedeem)) && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium"
                        >
                          You will receive:{" "}
                          <span className="text-primary">
                            ETB {parseInt(pointsToRedeem) * config.conversionRate}
                          </span>
                        </motion.p>
                      )}
                    </div>
                    <Button
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-2 transition-all duration-200"
                      onClick={handleRedeem}
                      disabled={redeeming || !pointsToRedeem || isNaN(parseInt(pointsToRedeem)) || parseInt(pointsToRedeem) <= 0}
                    >
                      {redeeming ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                        />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                      Redeem Points
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="mt-8 p-6 shadow-lg">
                <h2 className="font-heading text-2xl font-semibold mb-6">Transaction History</h2>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                  ) : (
                    transactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white/80 shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={transaction.type === 'earned' ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.points} Points
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}