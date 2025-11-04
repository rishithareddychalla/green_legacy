import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { DataTable } from '@/components/ui/data-table';

export function LoginsTable() {
  const fetchLogins = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/logins?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch logins');
    const json = await response.json();
    return {
      data: json.data ?? json.logins ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.logins ?? json) ? (json.data ?? json.logins ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Login Records</h2>
      <DataTable
        columns={[
          { key: 'email', label: 'Email' },
          { key: 'date', label: 'Date', render: (v) => new Date(v).toLocaleString() }
        ]}
        fetchData={fetchLogins}
        filename="logins-export"
        searchPlaceholder="Search logins..."
      />
    </div>
  );
}

export default LoginsTable;
