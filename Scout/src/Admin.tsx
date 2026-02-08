import React, { useState } from 'react';
import type { ScoutEntry } from './types';

interface AdminProps {
    entries: ScoutEntry[];
    onDeleteEntry: (id: string) => void;
    onEditEntry: (entry: ScoutEntry) => void;
    onClose: () => void;
}

export const Admin = ({ entries, onDeleteEntry, onEditEntry, onClose }: AdminProps) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '6038') {
            setIsAdminAuthenticated(true);
            setError('');
        } else {
            setError('Hatalı şifre!');
        }
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `scouting_data_${new Date().toISOString()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const stats = {
        totalEntries: entries.length,
        teams: Array.from(new Set(entries.map(e => e.teamNumber))),
        bestDriver: entries.reduce((prev, current) => (prev.driverSkill > current.driverSkill) ? prev : current, entries[0])
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Admin Girişi</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Yönetici Şifresi</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifreyi giriniz"
                            />
                        </div>
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Giriş Yap</button>
                            <button type="button" className="btn btn-link text-muted" onClick={onClose}>İptal</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>🛠️ Admin Paneli</h2>
                <div className="gap-2 d-flex">
                    <button className="btn btn-success" onClick={handleExport}>
                        <i className="bi bi-download me-1"></i> Veriyi Dışa Aktar
                    </button>
                    <button className="btn btn-outline-secondary" onClick={onClose}>
                        Kapat
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card bg-primary text-white shadow-sm border-0">
                        <div className="card-body">
                            <h6>Toplam Kayıt</h6>
                            <h3>{stats.totalEntries}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-info text-white shadow-sm border-0">
                        <div className="card-body">
                            <h6>Gözlemlenen Takım</h6>
                            <h3>{stats.teams.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-warning text-dark shadow-sm border-0">
                        <div className="card-body">
                            <h6>En İyi Sürücü (id)</h6>
                            <h3>{stats.bestDriver ? stats.bestDriver.teamNumber : 'N/A'}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive card shadow-sm">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Tarih/Saat</th>
                            <th>Takım #</th>
                            <th>Match #</th>
                            <th>Scout</th>
                            <th>Sürücü</th>
                            <th>Yorumlar</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(entry => (
                            <tr key={entry.id}>
                                <td>{entry.date} {entry.timestamp}</td>
                                <td><strong>{entry.teamNumber}</strong></td>
                                <td>{entry.matchNumber}</td>
                                <td>{entry.scoutName}</td>
                                <td>
                                    <span className={`badge ${entry.driverSkill > 7 ? 'bg-success' : entry.driverSkill > 4 ? 'bg-warning' : 'bg-danger'}`}>
                                        {entry.driverSkill}/10
                                    </span>
                                </td>
                                <td>
                                    <div className="small text-muted" style={{ maxWidth: '250px' }}>
                                        {entry.autonomousNotes && <div><strong>Auto:</strong> {entry.autonomousNotes}</div>}
                                        {entry.teleopNotes && <div><strong>Tele:</strong> {entry.teleopNotes}</div>}
                                        {entry.generalNotes && <div><strong>Gen:</strong> {entry.generalNotes}</div>}
                                        {!entry.autonomousNotes && !entry.teleopNotes && !entry.generalNotes && <span>-</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                onEditEntry(entry);
                                                onClose(); // Close admin panel to show the form for editing
                                            }}
                                            title="Düzenle"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => {
                                                if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
                                                    onDeleteEntry(entry.id);
                                                }
                                            }}
                                            title="Sil"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
