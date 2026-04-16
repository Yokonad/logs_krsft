import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasPermission } from '@/utils/permissions';

const API_BASE = '/api/logskrsft';

export function useLogsData(auth) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const permissions = useMemo(() => ({
        access: hasPermission(auth, 'module.logskrsft.access'),
        view: hasPermission(auth, 'module.logskrsft.view'),
        create: hasPermission(auth, 'module.logskrsft.create'),
        delete: hasPermission(auth, 'module.logskrsft.delete'),
    }), [auth]);

    const fetchData = useCallback(async () => {
        if (!permissions.access && !permissions.view) {
            setRows([]);
            return;
        }

        setLoading(true);
        try {
            const query = search ? `?search=${encodeURIComponent(search)}` : '';
            const response = await fetch(`${API_BASE}/list${query}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const json = await response.json();
            setRows(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [permissions.access, permissions.view, search]);

    const createSampleLog = useCallback(async () => {
        if (!permissions.create) return;

        await fetch(`${API_BASE}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                action: 'manual_event',
                message: 'Evento manual registrado desde el módulo Logs',
                level: 'info',
                user_name: auth?.user?.name ?? null,
            }),
        });

        await fetchData();
    }, [permissions.create, fetchData, auth]);

    const deleteLog = useCallback(async (id) => {
        if (!permissions.delete) return;

        await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        await fetchData();
    }, [permissions.delete, fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        rows,
        loading,
        search,
        setSearch,
        permissions,
        fetchData,
        createSampleLog,
        deleteLog,
    };
}
