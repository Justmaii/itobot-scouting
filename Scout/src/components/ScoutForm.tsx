import { useState } from 'react';
import type { ScoutEntry } from '../types';
import { fetchTeamName } from '../api/tba';

interface ScoutFormProps {
    onAdd: (entry: ScoutEntry) => void;
    onUpdate: (entry: ScoutEntry) => void;
    initialData?: ScoutEntry | null;
    onCancelEdit: () => void;
}

export const ScoutForm = ({ onAdd, onUpdate, initialData, onCancelEdit }: ScoutFormProps) => {
    const [formData, setFormData] = useState({
        scoutName: initialData?.scoutName || '',
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
            scoutName: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            const updatedEntry: ScoutEntry = {
                ...initialData,
                ...formData,
                driverSkill: Number(formData.driverSkill),
                // Keep original timestamp
            };
            onUpdate(updatedEntry);
        } else {
            const now = new Date();
            const newEntry: ScoutEntry = {
                id: Date.now().toString(),
                ...formData,
                driverSkill: Number(formData.driverSkill),
                timestamp: now.toLocaleTimeString(),
                date: now.toLocaleDateString('tr-TR') // DD.MM.YYYY format for TR locale
            };
            onAdd(newEntry);
        }
        resetForm();
    };

    return (
        <div className="card p-4" >
            <h3 className="mb-4 text-primary">{initialData ? 'Edit Entry' : 'New Entry'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Scout Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="scoutName"
                        placeholder="Adınız"
                        value={formData.scoutName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-6 mb-3">
                        <label className="form-label">Team #</label>
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
                    <button type="submit" className="btn btn-primary btn-lg">
                        {initialData ? 'Update Entry' : 'Save Entry'}
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
