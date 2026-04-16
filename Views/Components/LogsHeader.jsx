import Button from './ui/Button';
import Input from './ui/Input';

/**
 * @param {{
 *   search: string,
 *   setSearch: (value: string) => void,
 *   onRefresh: () => void,
 *   canCreate: boolean,
 *   onCreate: () => void
 * }} props
 */
export default function LogsHeader({ search, setSearch, onRefresh, canCreate, onCreate }) {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">LOGS DEL SISTEMA</h1>
                    <p className="text-sm text-gray-500">Consulta y trazabilidad de eventos registrados.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por acción, mensaje o usuario"
                    />
                    <Button variant="secondary" onClick={onRefresh}>Actualizar</Button>
                    {canCreate && <Button onClick={onCreate}>Nuevo Log</Button>}
                </div>
            </div>
        </div>
    );
}
