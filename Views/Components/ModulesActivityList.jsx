import { ChevronDownIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import clsx from 'clsx';

const formatModuleName = (slug) => {
  const map = {
    auth: 'Autenticación',
    compraskrsft: 'Compras',
    inventariokrsft: 'Inventario',
    rrhhkrsft: 'RRHH',
    proyectoskrsft: 'Proyectos',
    trabajadoreskrsft: 'Trabajadores',
    asistenciakrsft: 'Asistencia',
    cecskrsft: 'Centros de Costo',
  };
  return map[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatAction = (action) => {
  if (!action) return '-';
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ModulesActivityList({
  logs = [],
  availableModules = [],
  moduleCounts = {},
}) {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (mod) => {
    setExpandedModules((prev) => ({ ...prev, [mod]: !prev[mod] }));
  };

  // Group logs by module
  const logsByModule = {};
  availableModules.forEach((mod) => {
    logsByModule[mod] = Array.isArray(logs)
      ? logs.filter((log) => log.module === mod)
      : [];
  });

  // Include 'all' as an option to show combined
  // Exclude: all, logskrsft, telegramkrsft (they are not real marketplace modules)
  const excludedModules = ['all', 'logskrsft', 'telegramkrsft'];
  const allModules = ['all', ...availableModules.filter((m) => !excludedModules.includes(m))];

  return (
    <div className="space-y-4">
      {allModules.map((mod) => {
        const isExpanded = expandedModules[mod];
        const moduleLogs = logsByModule[mod] || [];
        const count = moduleCounts[mod] || moduleLogs.length || 0;

        return (
          <article
            key={mod}
            className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            {/* Module header row */}
            <header
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleModule(mod)}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <CubeIcon className="size-4" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {mod === 'all' ? 'Todos los Módulos' : formatModuleName(mod)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {count}
                  </span>
                </div>
              </div>

              <ChevronDownIcon
                className={clsx(
                  'size-5 text-gray-400 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </header>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-gray-100">
                {moduleLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500">
                    <CubeIcon className="size-8 text-gray-300 mb-2" />
                    <p>Sin actividades registradas</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr className="*:px-4 *:py-2 *:text-left *:text-xs *:font-medium *:uppercase *:tracking-wide *:text-gray-500">
                          <th>Acción</th>
                          <th>Mensaje</th>
                          <th>Usuario</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {moduleLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                {formatAction(log.action)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                              {log.message || '-'}
                            </td>
                            <td className="px-4 py-2">
                              <span className="text-sm font-medium text-gray-900">
                                {log.user_name || 'Sistema'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-500">
                              {formatDate(log.performed_at || log.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}