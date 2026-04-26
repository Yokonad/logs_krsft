import { Squares2X2Icon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function LogsTabBar({
  moduleFilter,
  setModuleFilter,
  availableModules = [],
}) {
  const tabs = [
    { key: 'auth', label: 'AUTENTICACIÓN', icon: ShieldCheckIcon },
    { key: 'all', label: 'TODOS MÓDULOS', icon: Squares2X2Icon },
  ];

  return (
    <div className="overflow-x-auto hide-scrollbar border-b border-gray-200">
      <div className="flex min-w-max gap-6" role="tablist" aria-label="Módulos de logs">
          {tabs.map((tab) => {
            const isActive = moduleFilter === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setModuleFilter(tab.key)}
                className={`inline-flex items-center gap-2 px-1 py-3 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
      </div>
    </div>
  );
}