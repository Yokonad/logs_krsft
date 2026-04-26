import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasPermission } from '@/utils/permissions';

const API_BASE = '/api/logskrsft';

export function useLogsData(auth) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [moduleFilter, setModuleFilter] = useState('auth');
    const [availableModules, setAvailableModules] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);

    const permissions = useMemo(() => ({
        access: hasPermission(auth, 'module.logskrsft.access'),
        view: hasPermission(auth, 'module.logskrsft.view'),
        create: hasPermission(auth, 'module.logskrsft.create'),
        delete: hasPermission(auth, 'module.logskrsft.delete'),
    }), [auth]);

    const fetchData = useCallback(async ({ silent = false } = {}) => {
        if (!permissions.access && !permissions.view) {
            setRows([]);
            return;
        }

        if (!silent) {
            setLoading(true);
        }
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (moduleFilter !== 'all' && moduleFilter !== 'todos') params.append('module', moduleFilter);
            if (levelFilter !== 'all') params.append('level', levelFilter);

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const response = await fetch(`${API_BASE}/list${queryString}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const json = await response.json();
            const incomingRows = Array.isArray(json?.data) ? json.data : [];
            setRows(incomingRows.map((row) => ({
                ...row,
                level: (row.level || 'info').toLowerCase(),
            })));
        } catch {
            if (!silent) {
                setRows([]);
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [permissions.access, permissions.view, search, moduleFilter, levelFilter]);

    const fetchModules = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/modules`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const json = await response.json();
            setAvailableModules(Array.isArray(json?.data) ? json.data : []);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/stats`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const json = await response.json();
            setDashboardStats(json?.data || null);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    const createLog = useCallback(async (params) => {
        if (!permissions.create) return;

        await fetch(`${API_BASE}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                ...params,
                user_name: auth?.user?.name ?? null,
            }),
        });

        await fetchData();
        await fetchStats();
        await fetchModules();
    }, [permissions.create, fetchData, fetchStats, fetchModules, auth]);

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
        await fetchStats();
    }, [permissions.delete, fetchData, fetchStats]);

    const filteredRows = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return rows;
        }

        return rows.filter((row) => {
            const haystack = [row.action, row.message, row.level, row.user_name, row.module]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedSearch);
        });
    }, [rows, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchModules();
        fetchStats();
    }, [fetchModules, fetchStats]);

    useEffect(() => {
        if (!permissions.access && !permissions.view) {
            return undefined;
        }

        const silentRefresh = () => {
            if (document.hidden) {
                return;
            }

            fetchData({ silent: true });
            fetchStats();
        };

        const intervalId = window.setInterval(silentRefresh, 15000);

        const handleReturnToForeground = () => {
            if (!document.hidden) {
                silentRefresh();
            }
        };

        window.addEventListener('focus', handleReturnToForeground);
        document.addEventListener('visibilitychange', handleReturnToForeground);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('focus', handleReturnToForeground);
            window.removeEventListener('visibilitychange', handleReturnToForeground);
        };
    }, [permissions.access, permissions.view, fetchData, fetchStats]);

    return {
        rows: filteredRows,
        rawRows: rows,
        loading,
        search,
        setSearch,
        levelFilter,
        setLevelFilter,
        moduleFilter,
        setModuleFilter,
        availableModules,
        dashboardStats,
        permissions,
        fetchData,
        createLog,
        deleteLog,
    };
}