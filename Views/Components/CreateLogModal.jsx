import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSubmit: (params: { action: string, message: string, level: string, module: string }) => Promise<void>,
 *   availableModules: string[],
 *   canCreate: boolean
 * }} props
 */
export default function CreateLogModal({ open, onClose, onSubmit, availableModules, canCreate }) {
    const [form, setForm] = useState({
        action: '',
        message: '',
        level: 'info',
        module: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.action.trim()) newErrors.action = 'La acción es requerida';
        if (!form.message.trim()) newErrors.message = 'El mensaje es requerido';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                action: form.action.trim(),
                message: form.message.trim(),
                level: form.level,
                module: form.module || 'logskrsft',
            });
            setForm({ action: '', message: '', level: 'info', module: '' });
            onClose();
        } catch (err) {
            console.error('Error creating log:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setForm({ action: '', message: '', level: 'info', module: '' });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            title="Crear entrada manual"
            titleIcon={<PlusIcon className="size-5" />}
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={submitting || !canCreate}>
                        {submitting ? 'Guardando...' : 'Crear entrada'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Acción"
                    name="action"
                    value={form.action}
                    onChange={handleChange('action')}
                    placeholder="Ej: user_login, order_created"
                    required
                    error={errors.action}
                />

                <div className="space-y-1">
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">
                            Mensaje <span className="text-red-500">*</span>
                        </span>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange('message')}
                            rows={4}
                            placeholder="Describe el evento que deseas registrar..."
                            className="mt-0.5 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:ring-primary"
                            required
                        />
                    </label>
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Select
                            label="Nivel"
                            name="level"
                            value={form.level}
                            onChange={handleChange('level')}
                        >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Select
                            label="Módulo"
                            name="module"
                            value={form.module}
                            onChange={handleChange('module')}
                            placeholder="Seleccionar módulo..."
                        >
                            {availableModules.map((mod) => (
                                <option key={mod} value={mod}>{mod}</option>
                            ))}
                        </Select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}