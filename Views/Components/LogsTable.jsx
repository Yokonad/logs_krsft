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
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-cyan-600 text-white">
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
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td className="px-4 py-3">{row.id}</td>
                            <td className="px-4 py-3">{row.action}</td>
                            <td className="max-w-lg px-4 py-3">{row.message}</td>
                            <td className="px-4 py-3">{row.level}</td>
                            <td className="px-4 py-3">{row.user_name || '-'}</td>
                            <td className="px-4 py-3">{row.created_at || '-'}</td>
                            <td className="px-4 py-3 text-right">
                                {canDelete && (
                                    <button
                                        className="rounded bg-rose-600 px-3 py-1 text-white"
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
                            <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                                No hay registros para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
