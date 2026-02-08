import { useState } from 'react';
import { ComparisonCard } from './ComparisonCard';
import { calculateTeamStats, getUniqueTeams } from '../utils';
import type { ScoutEntry } from '../types';

interface TeamComparisonProps {
    entries: ScoutEntry[];
}

export const TeamComparison = ({ entries }: TeamComparisonProps) => {
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const uniqueTeams = getUniqueTeams(entries);

    const handleTeamSelect = (teamNumber: string) => {
        if (!selectedTeams.includes(teamNumber)) {
            setSelectedTeams(prev => [...prev, teamNumber]);
        }
    };

    const handleRemoveTeam = (teamNumber: string) => {
        setSelectedTeams(prev => prev.filter(t => t !== teamNumber));
    };

    const availableTeams = uniqueTeams.filter(
        team => !selectedTeams.includes(team.teamNumber)
    );

    const comparisonStats = selectedTeams
        .map(teamNumber => calculateTeamStats(entries, teamNumber))
        .filter(stats => stats !== null);

    return (
        <div className="card p-4">
            <div className="mb-4">
                <h3 className="text-primary mb-3">Compare Teams</h3>
                <p className="text-muted">Select teams to compare their performance side by side</p>
            </div>

            {/* Team Selection */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <label className="form-label">Select a Team to Compare</label>
                    <select
                        className="form-select"
                        value=""
                        onChange={(e) => handleTeamSelect(e.target.value)}
                        disabled={availableTeams.length === 0}
                    >
                        <option value="">
                            {availableTeams.length === 0
                                ? 'All teams selected'
                                : 'Choose a team...'}
                        </option>
                        {availableTeams.map(team => (
                            <option key={team.teamNumber} value={team.teamNumber}>
                                {team.teamNumber} - {team.teamName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                    <div className="text-muted">
                        {selectedTeams.length > 0 && (
                            <small>
                                📊 Comparing {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''}
                            </small>
                        )}
                    </div>
                </div>
            </div>

            {/* Comparison Cards */}
            {selectedTeams.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🔍</div>
                    <h5 className="text-muted">No teams selected</h5>
                    <p className="text-muted">Select teams from the dropdown above to start comparing</p>
                </div>
            ) : (
                <div className="row g-4">
                    {comparisonStats.map(stats => (
                        <div
                            key={stats.teamNumber}
                            className={`col-md-${selectedTeams.length === 1 ? '12' : selectedTeams.length === 2 ? '6' : '4'}`}
                        >
                            <ComparisonCard
                                stats={stats}
                                onRemove={() => handleRemoveTeam(stats.teamNumber)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Section */}
            {selectedTeams.length > 1 && (
                <div className="mt-4 p-3 bg-light border rounded">
                    <h6 className="mb-3">Quick Summary</h6>
                    <div className="row text-center">
                        <div className="col-4">
                            <div className="fw-bold text-primary">
                                {comparisonStats.reduce((sum, s) => sum + s.totalEntries, 0)}
                            </div>
                            <small className="text-muted">Total Scouts</small>
                        </div>
                        <div className="col-4">
                            <div className="fw-bold text-success">
                                {Math.max(...comparisonStats.map(s => s.averageDriverSkill))}
                            </div>
                            <small className="text-muted">Highest Avg Skill</small>
                        </div>
                        <div className="col-4">
                            <div className="fw-bold text-info">
                                {(comparisonStats.reduce((sum, s) => sum + s.averageDriverSkill, 0) / comparisonStats.length).toFixed(1)}
                            </div>
                            <small className="text-muted">Overall Average</small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
