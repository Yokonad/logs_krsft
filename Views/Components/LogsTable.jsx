import {
    ExclamationCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import Badge from './ui/Badge';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

/**
 * @param {{
 *   rows: Array<{ id: number, action: string, message: string, level: string, user_name?: string, module?: string, ip_address?: string, extra?: any, performed_at?: string, created_at?: string }>,
 *   loading: boolean,
 *   canDelete: boolean,
 *   onDelete: (id: number) => void
 * }} props
 */
export default function LogsTable({ rows, loading, canDelete, onDelete }) {
    const [expandedRow, setExpandedRow] = useState(null);

    if (loading) {
        return <LoadingSpinner message="Cargando eventos de auditoría..." />;
    }

    if (!rows.length) {
        return (
            <EmptyState
                icon={<InformationCircleIcon className="size-6" />}
                title="Sin registros encontrados"
                subtitle="No hay eventos que coincidan con los filtros seleccionados."
            />
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-3 py-3 text-center whitespace-nowrap">ID</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Origen/Módulo</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Acción</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Nivel</th>
                        <th className="px-3 py-3 text-center">Mensaje</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Usuario / IP</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Fecha</th>
                        <th className="px-3 py-3 text-right whitespace-nowrap">Detalles</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => {
                        const isExpanded = expandedRow === row.id;
                        return (
                            <Fragment key={row.id}>
                                <tr className="transition-colors hover:bg-gray-50/50">
                                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">#{row.id}</td>
                                    <td className="px-3 py-3 whitespace-nowrap text-center">{renderModuleBadge(row.module)}</td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-700">{row.action}</td>
                                    <td className="px-3 py-3 whitespace-nowrap text-center">{renderLevelBadge(row.level)}</td>
                                    <td className="px-3 py-3 text-gray-700 max-w-[420px] truncate" title={row.message}>
                                        {row.message}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-center">
                                        <p className="font-medium text-gray-900">{row.user_name || '-'}</p>
                                        <p className="text-xs text-gray-500">{row.ip_address || '0.0.0.0'}</p>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-gray-700 text-center">
                                        {formatDate(row.performed_at || row.created_at)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                                                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                                title={isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                                            >
                                                {isExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                                            </button>
                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => onDelete(row.id)}
                                                    title="Eliminar log"
                                                >
                                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>

                                {isExpanded && (
                                    <tr className="bg-gray-50/60">
                                        <td colSpan={8} className="px-4 py-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Mensaje completo</h4>
                                                    <p className="mt-1 rounded border border-gray-200 bg-white p-3 text-sm text-gray-700">
                                                        {row.message}
                                                    </p>
                                                </div>
                                                {row.extra && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">Datos adicionales (JSON)</h4>
                                                        <pre className="mt-1 overflow-x-auto rounded border border-gray-200 bg-slate-900 p-3 text-xs text-slate-200">
                                                            {formatJsonExtra(row.extra)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function renderLevelBadge(level) {
    const current = String(level || 'info').toLowerCase();

    if (current === 'error') {
        return (
            <Badge variant="danger" icon={<ExclamationCircleIcon className="size-4" />} className="text-xs">
                Error
            </Badge>
        );
    }

    if (current === 'warning') {
        return (
            <Badge variant="warning" icon={<ExclamationTriangleIcon className="size-4" />} className="text-xs">
                Warning
            </Badge>
        );
    }

    return (
        <Badge variant="blue" icon={<InformationCircleIcon className="size-4" />} className="text-xs">
            Info
        </Badge>
    );
}

function renderModuleBadge(module) {
    if (!module) return <Badge variant="gray" border className="text-xs">CORE</Badge>;

    const label = module.replace('krsft', '').toUpperCase();
    let variant = 'gray';

    if (module === 'auth') variant = 'blue';
    if (module === 'compraskrsft') variant = 'emerald';
    if (module === 'inventariokrsft') variant = 'amber';
    if (module === 'proyectoskrsft') variant = 'purple';
    if (module === 'trabajadoreskrsft') variant = 'cyan';
    if (module === 'asistenciakrsft') variant = 'red';

    return <Badge border variant={variant} className="text-xs">{label}</Badge>;
}

function formatJsonExtra(extra) {
    try {
        const parsed = typeof extra === 'string' ? JSON.parse(extra) : extra;
        return JSON.stringify(parsed, null, 2);
    } catch {
        return String(extra);
    }
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
        second: '2-digit',
    }).format(date);
}
