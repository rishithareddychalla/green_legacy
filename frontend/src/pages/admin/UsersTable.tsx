import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { DataTable } from '@/components/ui/data-table';

export function UsersTable() {
  const fetchUsers = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/users?page=${page}&search=${search}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const json = await response.json();
    return {
      data: json.data ?? json.users ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.users ?? json) ? (json.data ?? json.users ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { 
            key: 'date', 
            label: 'Join Date',
            render: (value) => new Date(value).toLocaleDateString()
          }
        ]}
        fetchData={fetchUsers}
        filename="users-export"
        searchPlaceholder="Search users..."
      />
    </div>
  );
}