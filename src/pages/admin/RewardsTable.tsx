import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Download, Edit2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RewardRecord {
  id: string;
  donorName: string;
  email: string;
  greenPoints: number;
  walletBalance: number;
  lastUpdated: string;
}

export function RewardsTable() {
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReward, setSelectedReward] = useState<RewardRecord | null>(null);
  const [editPoints, setEditPoints] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RewardRecord;
    direction: 'asc' | 'desc';
  }>({ key: 'greenPoints', direction: 'desc' });

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock data for demonstration
    const mockRewards: RewardRecord[] = [
      {
        id: '1',
        donorName: 'John Doe',
        email: 'john@example.com',
        greenPoints: 1000,
        walletBalance: 100,
        lastUpdated: '2025-01-15',
      },
      // Add more mock rewards...
    ];
    setRewards(mockRewards);
  }, []);

  const handleSort = (key: keyof RewardRecord) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredRewards = sortedRewards.filter(
    (reward) =>
      reward.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdatePoints = () => {
    if (!selectedReward || !editPoints) return;

    // TODO: Replace with actual API call
    const updatedRewards = rewards.map((reward) =>
      reward.id === selectedReward.id
        ? {
            ...reward,
            greenPoints: parseInt(editPoints),
            walletBalance: parseInt(editPoints) * 0.1, // Example conversion rate: 10 points = $1
            lastUpdated: new Date().toISOString(),
          }
        : reward
    );

    setRewards(updatedRewards);
    setSelectedReward(null);
    setEditPoints('');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRewards);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rewards');
    XLSX.writeFile(workbook, 'rewards.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search rewards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('greenPoints')}
              >
                Green Points
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('walletBalance')}
              >
                Wallet Balance
              </TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.donorName}</TableCell>
                <TableCell>{reward.email}</TableCell>
                <TableCell>{reward.greenPoints}</TableCell>
                <TableCell>${reward.walletBalance.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(reward.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReward(reward)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Green Points</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Current Points: {reward.greenPoints}</Label>
                          <Input
                            type="number"
                            value={editPoints}
                            onChange={(e) => setEditPoints(e.target.value)}
                            placeholder="Enter new points value"
                          />
                        </div>
                        <Button onClick={handleUpdatePoints}>
                          Update Points
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}