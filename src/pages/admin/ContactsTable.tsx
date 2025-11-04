import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function ContactsTable() {
  const [page, setPage] = useState(1);

  const fetchContacts = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/contacts?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    const json = await response.json();
    // normalize to { data, pagination }
    return {
      data: json.data ?? json.contacts ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.contacts ?? json) ? (json.data ?? json.contacts ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Submissions</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'message', label: 'Message' },
          { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() }
        ]}
        fetchData={fetchContacts}
        filename="contacts-export"
        searchPlaceholder="Search contacts..."
      />
    </div>
  );
}