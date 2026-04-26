import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const CONFIG_ENDPOINT = '/api/settings/integrations/discord-webhook';
const TEST_ENDPOINT = '/api/settings/integrations/discord-webhook/test';

export default function DiscordConfigPanel() {
    const csrfToken = useMemo(
        () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
        [],
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    const [enabled, setEnabled] = useState(false);
    const [configured, setConfigured] = useState(false);
    const [maskedWebhook, setMaskedWebhook] = useState(null);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        void loadConfig();
    }, []);

    const requestJson = async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
                ...(options.headers || {}),
            },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload?.success === false) {
            throw new Error(payload?.message || 'No se pudo completar la operación.');
        }

        return payload;
    };

    const loadConfig = async () => {
        setLoading(true);
        setNotice(null);

        try {
            const payload = await requestJson(CONFIG_ENDPOINT, { method: 'GET' });
            setEnabled(Boolean(payload?.data?.enabled));
            setConfigured(Boolean(payload?.data?.configured));
            setMaskedWebhook(payload?.data?.masked_webhook ?? null);
        } catch (error) {
            setNotice({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setNotice(null);

        try {
            const body = { enabled };
            if (webhookUrl.trim() !== '') {
                body.webhook_url = webhookUrl.trim();
            }

            const payload = await requestJson(CONFIG_ENDPOINT, {
                method: 'PUT',
                body: JSON.stringify(body),
            });

            setConfigured(Boolean(payload?.data?.configured));
            setMaskedWebhook(payload?.data?.masked_webhook ?? null);
            setWebhookUrl('');
            setNotice({ type: 'success', message: payload?.message || 'Configuración guardada.' });
        } catch (error) {
            setNotice({ type: 'error', message: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleClearWebhook = async () => {
        setSaving(true);
        setNotice(null);

        try {
            const payload = await requestJson(CONFIG_ENDPOINT, {
                method: 'PUT',
                body: JSON.stringify({ enabled: false, clear_webhook: true }),
            });

            setEnabled(false);
            setConfigured(false);
            setMaskedWebhook(null);
            setWebhookUrl('');
            setNotice({ type: 'success', message: payload?.message || 'Webhook eliminado correctamente.' });
        } catch (error) {
            setNotice({ type: 'error', message: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setNotice(null);

        try {
            const payload = await requestJson(TEST_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({}),
            });

            setNotice({ type: 'success', message: payload?.message || 'Prueba enviada correctamente.' });
        } catch (error) {
            setNotice({ type: 'error', message: error.message });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {notice && (
                <div
                    role="alert"
                    className={`rounded-lg border p-4 text-sm ${
                        notice.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                >
                    <div className="flex items-start gap-2">
                        {notice.type === 'success' ? (
                            <CheckCircleIcon className="size-5 shrink-0" />
                        ) : (
                            <ExclamationTriangleIcon className="size-5 shrink-0" />
                        )}
                        <p>{notice.message}</p>
                    </div>
                </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <ShieldCheckIcon className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Discord Webhook</h3>
                        <p className="text-sm text-gray-500">Gestiona alertas de login y errores críticos desde Settings.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Activar notificaciones Discord</p>
                            <p className="text-xs text-gray-500">Si está activo, los eventos críticos se envían al webhook configurado.</p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={enabled}
                            onChange={(event) => setEnabled(event.target.checked)}
                        />
                    </label>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700" htmlFor="discord-webhook-url">
                            URL del Webhook
                        </label>
                        <input
                            id="discord-webhook-url"
                            type="url"
                            value={webhookUrl}
                            onChange={(event) => setWebhookUrl(event.target.value)}
                            placeholder="https://discord.com/api/webhooks/..."
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500">
                            Si no escribes una URL nueva, se mantiene la actual guardada.
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                        <p>
                            Estado: <span className="font-semibold">{configured ? 'Configurado' : 'Sin configurar'}</span>
                        </p>
                        {maskedWebhook && <p className="mt-1 break-all text-xs text-gray-500">Webhook actual: {maskedWebhook}</p>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Guardar configuración'}
                        </button>

                        <button
                            type="button"
                            onClick={handleTest}
                            disabled={testing || !configured || !enabled}
                            className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <PaperAirplaneIcon className="size-4" />
                            {testing ? 'Enviando prueba...' : 'Probar webhook'}
                        </button>

                        <button
                            type="button"
                            onClick={handleClearWebhook}
                            disabled={saving || !configured}
                            className="inline-flex items-center rounded px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Eliminar webhook guardado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
