import {
  ClockIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './ui/StatsCard';

export default function LogsStats({ stats }) {
  const safeStats = stats ?? { total: 0, info: 0, warning: 0, error: 0 };
  return (
    <section
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))' }}
    >
      <div className="min-w-0">
        <StatsCard
          title="Eventos Totales"
          value={safeStats.total}
          icon={<ClockIcon className="size-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>
      <div className="min-w-0">
        <StatsCard
          title="Informativos"
          value={safeStats.info}
          icon={<InformationCircleIcon className="size-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>
      <div className="min-w-0">
        <StatsCard
          title="Advertencias"
          value={safeStats.warning}
          icon={<ExclamationTriangleIcon className="size-5" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>
      <div className="min-w-0">
        <StatsCard
          title="Errores Críticos"
          value={safeStats.error}
          icon={<CheckCircleIcon className="size-5" />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>
    </section>
  );
}