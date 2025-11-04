import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { DataTable } from '@/components/ui/data-table';

export function DonationsTableNew() {
  const fetchDonations = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/donations?page=${page}&search=${search}`);
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    const { donations, pagination } = await response.json();
    return {
      data: donations,
      pagination
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Donations</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Donor Name' },
          { key: 'email', label: 'Email' },
          { 
            key: 'amount', 
            label: 'Amount',
            render: (value) => `$${Number(value).toFixed(2)}`
          },
          { key: 'paymentId', label: 'Payment ID' },
          { 
            key: 'date', 
            label: 'Date',
            render: (value) => new Date(value).toLocaleDateString()
          }
        ]}
        fetchData={fetchDonations}
        filename="donations-export"
        searchPlaceholder="Search donations..."
      />
    </div>
  );
}