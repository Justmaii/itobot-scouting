import { useState } from 'react';
import type { ScoutEntry } from '../types';
import { fetchTeamName } from '../api/tba';

interface ScoutFormProps {
    onAdd: (entry: Omit<ScoutEntry, 'id'>) => Promise<string | void>;
    onUpdate: (id: string, entry: Partial<ScoutEntry>) => Promise<void>;
    initialData?: ScoutEntry | null;
    onCancelEdit: () => void;
    currentUser: string;
}

export const ScoutForm = ({ onAdd, onUpdate, initialData, onCancelEdit, currentUser }: ScoutFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        scoutName: initialData?.scoutName || currentUser,
        teamNumber: initialData?.teamNumber || '',
        matchNumber: initialData?.matchNumber || '',
        teamName: initialData?.teamName || '',
        driverSkill: initialData?.driverSkill || 5,
        autonomousNotes: initialData?.autonomousNotes || '',
        teleopNotes: initialData?.teleopNotes || '',
        generalNotes: initialData?.generalNotes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fetch team name when team number is entered
        if (name === 'teamNumber' && value.length >= 1) {
            fetchTeamName(value).then(name => {
                if (name) {
                    setFormData(prev => ({
                        ...prev,
                        teamName: name
                    }));
                }
            });
        }
    };

    const resetForm = () => {
        setFormData({
            scoutName: currentUser,
            teamNumber: '',
            matchNumber: '',
            teamName: '',
            driverSkill: 5,
            autonomousNotes: '',
            teleopNotes: '',
            generalNotes: ''
        });
        onCancelEdit();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (initialData) {
                await onUpdate(initialData.id, {
                    ...formData,
                    driverSkill: Number(formData.driverSkill)
                });
            } else {
                const now = new Date();
                await onAdd({
                    ...formData,
                    driverSkill: Number(formData.driverSkill),
                    timestamp: now.toLocaleTimeString(),
                    date: now.toLocaleDateString('tr-TR')
                } as any); // Cast as any if there's minor mismatch with Omit<ScoutEntry, 'id'>
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Kayıt sırasında bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card p-4" >
            <h3 className="mb-4 text-primary">{initialData ? 'Girişi Düzenle' : 'Yeni Giriş'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Scout Adı</label>
                    <input
                        type="text"
                        className="form-control bg-light"
                        name="scoutName"
                        value={formData.scoutName}
                        readOnly
                        required
                    />
                    <small className="text-muted">Giriş yapan: {currentUser}</small>
                </div>

                <div className="row">
                    <div className="col-6 mb-3">
                        <label className="form-label">Takım #</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            name="teamNumber"
                            placeholder="6038"
                            value={formData.teamNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label">Match #</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            name="matchNumber"
                            placeholder="1"
                            value={formData.matchNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Driver Skill (1-10): {formData.driverSkill}</label>
                    <input
                        type="range"
                        className="form-range"
                        name="driverSkill"
                        min="1"
                        max="10"
                        step="1"
                        value={formData.driverSkill}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Autonomous Notes</label>
                    <textarea
                        className="form-control"
                        name="autonomousNotes"
                        rows={2}
                        value={formData.autonomousNotes}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Teleop Notes</label>
                    <textarea
                        className="form-control"
                        name="teleopNotes"
                        rows={2}
                        value={formData.teleopNotes}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="form-label">General Notes</label>
                    <textarea
                        className="form-control"
                        name="generalNotes"
                        rows={2}
                        value={formData.generalNotes}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Kaydediliyor...' : (initialData ? 'Girişi Güncelle' : 'Girişi Kaydet')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={resetForm}
                    >
                        {initialData ? 'Cancel Edit' : 'Reset Form'}
                    </button>
                </div>
            </form>
        </div >
    );
};
