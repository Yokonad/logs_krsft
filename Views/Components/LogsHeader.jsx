import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

export default function LogsHeader() {
  const goBack = () => window.history.back();
  const dashboardIconPath = '/api/module-icon/logskrsft';

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
      <div className="flex items-center gap-4">
        <Button variant="primary" size="md" onClick={goBack} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          Volver
        </Button>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary p-2 shadow-2xl">
            <img
              src={dashboardIconPath}
              alt="Logs"
              className="pointer-events-none size-7"
              style={{ filter: 'brightness(0) invert(1)', opacity: 1 }}
              draggable={false}
            />
          </span>
          <span>
            CENTRO DE AUDITORÍA
            <p className="text-sm font-normal text-gray-500">Rastreo centralizado de eventos y errores del sistema</p>
          </span>
        </h1>
      </div>
    </header>
  );
}