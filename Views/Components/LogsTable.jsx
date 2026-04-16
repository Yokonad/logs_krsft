/**
 * @param {{
 *   rows: Array<{ id: number, action: string, message: string, level: string, user_name?: string, created_at?: string }>,
 *   loading: boolean,
 *   canDelete: boolean,
 *   onDelete: (id: number) => void
 * }} props
 */
export default function LogsTable({ rows, loading, canDelete, onDelete }) {
    if (loading) {
        return <div className="rounded-xl bg-white p-4 shadow-sm">Cargando logs...</div>;
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Acción</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Mensaje</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Nivel</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Fecha</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
                    {rows.map((row, idx) => (
                        <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                            <td className="px-4 py-3">{row.id}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{row.action}</td>
                            <td className="max-w-lg px-4 py-3 text-gray-600">{row.message}</td>
                            <td className="px-4 py-3">{renderLevelBadge(row.level)}</td>
                            <td className="px-4 py-3">{row.user_name || '-'}</td>
                            <td className="px-4 py-3">{formatDate(row.created_at)}</td>
                            <td className="px-4 py-3 text-right">
                                {canDelete && (
                                    <button
                                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-white transition hover:bg-rose-700"
                                        onClick={() => onDelete(row.id)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {!rows.length && (
                        <tr>
                            <td className="px-4 py-10 text-center text-gray-500" colSpan={7}>
                                <p className="text-base font-medium text-gray-700">Sin resultados para los filtros actuales</p>
                                <p className="mt-1 text-sm text-gray-500">Prueba cambiando el nivel o limpiando la búsqueda.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function renderLevelBadge(level) {
    const current = String(level || 'info').toLowerCase();

    if (current === 'error') {
        return <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">Error</span>;
    }

    if (current === 'warning') {
        return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Warning</span>;
    }

    return <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">Info</span>;
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
