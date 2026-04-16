import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasPermission } from '@/utils/permissions';

const API_BASE = '/api/logskrsft';

export function useLogsData(auth) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');

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
            const incomingRows = Array.isArray(json?.data) ? json.data : [];
            setRows(incomingRows.map((row) => ({
                ...row,
                level: (row.level || 'info').toLowerCase(),
            })));
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

    const filteredRows = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return rows.filter((row) => {
            if (levelFilter !== 'all' && row.level !== levelFilter) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const haystack = [row.action, row.message, row.level, row.user_name]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedSearch);
        });
    }, [rows, levelFilter, search]);

    const stats = useMemo(() => {
        const base = { total: rows.length, info: 0, warning: 0, error: 0 };

        for (const row of rows) {
            if (row.level === 'warning') base.warning += 1;
            else if (row.level === 'error') base.error += 1;
            else base.info += 1;
        }

        return base;
    }, [rows]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        rows: filteredRows,
        rawRows: rows,
        loading,
        search,
        setSearch,
        levelFilter,
        setLevelFilter,
        stats,
        permissions,
        fetchData,
        createSampleLog,
        deleteLog,
    };
}
