import type { TeamStats } from '../utils';

interface ComparisonCardProps {
    stats: TeamStats;
    onRemove: () => void;
}

export const ComparisonCard = ({ stats, onRemove }: ComparisonCardProps) => {
    const getSkillColor = (skill: number) => {
        if (skill >= 8) return 'success';
        if (skill >= 6) return 'warning';
        return 'danger';
    };

    return (
        <div className="card comparison-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h4 className="text-primary mb-1">Team {stats.teamNumber}</h4>
                    <p className="text-muted mb-0">{stats.teamName}</p>
                </div>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={onRemove}
                    title="Remove from comparison"
                >
                    ×
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value">{stats.totalEntries}</div>
                    <div className="stat-label">Total Scouts</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">
                        <span className={`badge bg-${getSkillColor(stats.averageDriverSkill)}`}>
                            {stats.averageDriverSkill}
                        </span>
                    </div>
                    <div className="stat-label">Avg Driver Skill</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value text-success">{stats.highestSkill}</div>
                    <div className="stat-label">Best Performance</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📉</div>
                    <div className="stat-value text-danger">{stats.lowestSkill}</div>
                    <div className="stat-label">Lowest Performance</div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-top">
                <small className="text-muted">
                    <strong>Last Scout:</strong> {stats.lastScoutDate}
                </small>
            </div>

            {/* Visual Performance Bar */}
            <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Performance</small>
                    <small className="text-muted">{stats.averageDriverSkill}/10</small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                    <div
                        className={`progress-bar bg-${getSkillColor(stats.averageDriverSkill)}`}
                        style={{ width: `${(stats.averageDriverSkill / 10) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
