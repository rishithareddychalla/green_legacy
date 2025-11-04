import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function CSRTable() {
  const [page, setPage] = useState(1);

  const fetchCSR = async (page: number, search: string) => {
    const response = await fetchWithAuth(`/api/admin/csr?page=${page}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch CSR inquiries');
    const json = await response.json();
    return {
      data: json.data ?? json.inquiries ?? json.csr ?? json,
      pagination: json.pagination ?? { page: 1, total: Array.isArray(json.data ?? json.inquiries ?? json.csr ?? json) ? (json.data ?? json.inquiries ?? json.csr ?? json).length : 0, pages: 1 }
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">CSR Inquiries</h2>
      <DataTable
        columns={[
          { key: 'company', label: 'Company' },
          { key: 'contactPerson', label: 'Contact Person' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'proposal', label: 'Proposal' },
          { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() }
        ]}
        fetchData={fetchCSR}
        filename="csr-export"
        searchPlaceholder="Search CSR inquiries..."
      />
    </div>
  );
}