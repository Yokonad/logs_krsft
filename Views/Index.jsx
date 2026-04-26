import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useLogsData } from './hooks/useLogsData';
import LogsHeader from './Components/LogsHeader';
import LogsStats from './Components/LogsStats';
import LogsTabBar from './Components/LogsTabBar';
import LogsTable from './Components/LogsTable';
import CreateLogModal from './Components/CreateLogModal';
import ModulesActivityList from './Components/ModulesActivityList';

export default function LogsIndex({ auth: authFromProps = null }) {
    const auth = authFromProps ?? null;
    const d = useLogsData(auth);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.add('hide-page-scrollbar');
        document.body.classList.add('hide-page-scrollbar');

        return () => {
            document.documentElement.classList.remove('hide-page-scrollbar');
            document.body.classList.remove('hide-page-scrollbar');
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-12 py-4">
                <div className="space-y-6">
                    <LogsHeader />

                    <LogsStats stats={d.dashboardStats} />

                    <LogsTabBar
                        moduleFilter={d.moduleFilter}
                        setModuleFilter={d.setModuleFilter}
                        availableModules={d.availableModules}
                    />

                    {/* Filters bar */}
                    <div className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 shadow-sm">
                        <label htmlFor="logs-search" className="relative min-w-[200px] flex-1">
                            <input
                                id="logs-search"
                                type="text"
                                value={d.search}
                                onChange={(e) => d.setSearch(e.target.value)}
                                placeholder="Buscar acción, mensaje o usuario..."
                                className="h-[38px] w-full rounded border border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm transition-colors focus:border-primary focus:ring-primary"
                            />
                            <span className="absolute inset-y-0 right-2 grid w-8 place-content-center text-gray-500">
                                <MagnifyingGlassIcon className="size-4" />
                            </span>
                        </label>

                        <label htmlFor="logs-level">
                            <select
                                id="logs-level"
                                value={d.levelFilter}
                                onChange={(e) => d.setLevelFilter(e.target.value)}
                                className="h-[38px] rounded border border-gray-300 py-2 pl-3 pr-8 text-sm shadow-sm transition-colors focus:border-primary focus:ring-primary"
                            >
                                <option value="all">Todos los niveles</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </select>
                        </label>

                        <span className="ml-auto inline-flex items-center gap-2 text-xs text-gray-400">
                            <FunnelIcon className="size-4" />
                            Filtros activos
                        </span>

                        {d.permissions.create && (
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
                            >
                                <PlusIcon className="size-4" />
                                Crear entrada manual
                            </button>
                        )}
                    </div>

                    {d.moduleFilter === 'todos' ? (
                        <ModulesActivityList
                            logs={d.rawRows}
                            availableModules={d.availableModules}
                            moduleCounts={d.dashboardStats?.modules || {}}
                        />
                    ) : (
                        <LogsTable
                            rows={d.rows}
                            loading={d.loading}
                            canDelete={d.permissions.delete}
                            onDelete={d.deleteLog}
                        />
                    )}
                </div>
            </div>

            <CreateLogModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={(params) => d.createLog(params)}
                availableModules={d.availableModules}
                canCreate={d.permissions.create}
            />
        </div>
    );
}