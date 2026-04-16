import Button from './ui/Button';
import Input from './ui/Input';
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PlusCircleIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

/**
 * @param {{
 *   search: string,
 *   setSearch: (value: string) => void,
 *   levelFilter: string,
 *   setLevelFilter: (value: string) => void,
 *   onRefresh: () => void,
 *   canCreate: boolean,
 *   onCreate: () => void,
 *   stats: { total: number, info: number, warning: number, error: number }
 * }} props
 */
export default function LogsHeader({
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    onRefresh,
    canCreate,
    onCreate,
    stats,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-5 py-4 text-white">
                <h1 className="text-xl font-semibold tracking-wide">CENTRO DE LOGS</h1>
                <p className="mt-1 text-sm text-cyan-50">Monitoreo en tiempo real de eventos del sistema ERP.</p>
            </div>

            <div className="grid gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4 md:grid-cols-4">
                <StatPill label="Total" value={stats.total} tone="text-slate-700" />
                <StatPill label="Info" value={stats.info} tone="text-teal-700" />
                <StatPill label="Warning" value={stats.warning} tone="text-amber-700" />
                <StatPill label="Error" value={stats.error} tone="text-rose-700" />
            </div>

            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="hidden rounded-lg bg-teal-50 p-2 text-teal-700 sm:block">
                        <MagnifyingGlassIcon className="size-5" />
                    </div>
                    <div className="w-full max-w-md">
                        <Input
                            value={search}
                            onChange={setSearch}
                            placeholder="Buscar por acción, mensaje o usuario"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                        <FunnelIcon className="size-4 text-gray-500" />
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="bg-transparent text-sm text-gray-700 outline-none"
                        >
                            <option value="all">Todos</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </label>

                    <Button variant="secondary" onClick={onRefresh} className="gap-2">
                        <ArrowPathIcon className="size-4" />
                        Actualizar
                    </Button>

                    {canCreate && (
                        <Button onClick={onCreate} className="gap-2">
                            <PlusCircleIcon className="size-4" />
                            Nuevo Log
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatPill({ label, value, tone }) {
    return (
        <div className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
        </div>
    );
}
