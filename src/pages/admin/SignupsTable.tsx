import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { DataTable } from '@/components/ui/data-table';

export function SignupsTable() {
  const fetchSignups = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/signups?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch signups');
    const json = await response.json();
    return {
      data: json.data ?? json.signups ?? json.users ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.signups ?? json.users ?? json) ? (json.data ?? json.signups ?? json.users ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Signups</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'date', label: 'Joined', render: (v) => new Date(v).toLocaleDateString() }
        ]}
        fetchData={fetchSignups}
        filename="signups-export"
        searchPlaceholder="Search signups..."
      />
    </div>
  );
}

export default SignupsTable;
