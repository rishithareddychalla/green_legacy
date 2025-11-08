import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function VolunteersTable() {
  const [page, setPage] = useState(1);

  const fetchVolunteers = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/volunteers?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch volunteers');
    const json = await response.json();
    return {
      data: json.data ?? json.volunteers ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.volunteers ?? json) ? (json.data ?? json.volunteers ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Volunteer Applications</h2>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'interest', label: 'Area of Interest' },
          { key: 'date', label: 'Application Date', render: (value) => new Date(value).toLocaleDateString() }
        ]}
        fetchData={fetchVolunteers}
        filename="volunteers-export"
        searchPlaceholder="Search volunteers..."
      />
    </div>
  );
}