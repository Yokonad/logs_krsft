import { usePage } from '@inertiajs/react';

import { useLogsData } from './hooks/useLogsData';
import LogsHeader from './Components/LogsHeader';
import LogsTable from './Components/LogsTable';

export default function LogsIndex() {
    const { auth } = usePage().props;
    const d = useLogsData(auth);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4">
                <LogsHeader
                    search={d.search}
                    setSearch={d.setSearch}
                    onRefresh={d.fetchData}
                    canCreate={d.permissions.create}
                    onCreate={d.createSampleLog}
                />

                <LogsTable
                    rows={d.rows}
                    loading={d.loading}
                    canDelete={d.permissions.delete}
                    onDelete={d.deleteLog}
                />
            </div>
        </div>
    );
}
