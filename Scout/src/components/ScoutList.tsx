import { useState } from 'react';
import type { ScoutEntry } from '../types';

interface ScoutListProps {
    entries: ScoutEntry[];
    onDelete: (id: string) => void;
    onEdit: (entry: ScoutEntry) => void;
}

export const ScoutList = ({ entries, onDelete, onEdit }: ScoutListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEntries = entries.filter(entry =>
        entry.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamNumber.includes(searchTerm)
    );

    return (
        <div className="card p-4">
            <div className="row justify-content-between align-items-center mb-4">
                <div className="col-12 col-md-auto">
                    <h3 className="mb-0" style={{ color: 'var(--primary-color)' }}>Recent Entries</h3>
                </div>
                <div className="col-12 col-md-4 mt-2 mt-md-0">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Scout</th>
                            <th>Team</th>
                            <th>Team Name</th>
                            <th>Match</th>
                            <th>Skill</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center text-muted">No entries found.</td>
                            </tr>
                        ) : (
                            filteredEntries.map(entry => (
                                <tr key={entry.id}>
                                    <td><span className="fw-bold">{entry.scoutName}</span></td>
                                    <td><span className="badge bg-info">{entry.teamNumber}</span></td>
                                    <td><span>{entry.teamName}</span></td>
                                    <td>#{entry.matchNumber}</td>
                                    <td><span className="badge bg-success">{entry.driverSkill}/10</span></td>
                                    <td><small className="text-muted">{entry.date}</small></td>
                                    <td><small className="text-muted">{entry.timestamp}</small></td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-warning me-1"
                                            onClick={() => onEdit(entry)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => onDelete(entry.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
