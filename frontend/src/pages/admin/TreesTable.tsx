import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function TreesTable() {
  const [page, setPage] = useState(1);

  const fetchTrees = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/trees?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch trees');
    const json = await response.json();
    return {
      data: json.data ?? json.trees ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.trees ?? json) ? (json.data ?? json.trees ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Trees Registry</h2>
      <DataTable
        columns={[
          { key: 'donor_name', label: 'Donor Name' },
          { key: 'species_name', label: 'Species' },
          { key: 'tree_id', label: 'Tree ID' },
          { key: 'location', label: 'Location' },
          { key: 'date', label: 'Planting Date', render: (value) => new Date(value).toLocaleDateString() }
        ]}
        fetchData={fetchTrees}
        filename="trees-export"
        searchPlaceholder="Search trees..."
      />
    </div>
  );
}