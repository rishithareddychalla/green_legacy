import { DataTable } from '@/components/ui/data-table';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function DonationsTable() {
  const fetchDonations = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/donations?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    const json = await response.json();
    return {
      data: json.data ?? json.donations ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.donations ?? json) ? (json.data ?? json.donations ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Donations</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Donor Name' },
          { key: 'email', label: 'Email' },
          { key: 'amount', label: 'Amount', render: (v) => `$${Number(v).toFixed(2)}` },
          { key: 'paymentId', label: 'Payment ID' },
          { key: 'date', label: 'Date', render: (v) => new Date(v).toLocaleDateString() }
        ]}
        fetchData={fetchDonations}
        filename="donations-export"
        searchPlaceholder="Search donations..."
      />
    </div>
  );
}