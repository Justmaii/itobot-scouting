import type { ScoutEntry } from './types';

export interface TeamStats {
    teamNumber: string;
    teamName: string;
    totalEntries: number;
    averageDriverSkill: number;
    highestSkill: number;
    lowestSkill: number;
    lastScoutDate: string;
    allEntries: ScoutEntry[];
}

export const calculateTeamStats = (entries: ScoutEntry[], teamNumber: string): TeamStats | null => {
    const teamEntries = entries.filter(entry => entry.teamNumber === teamNumber);

    if (teamEntries.length === 0) {
        return null;
    }

    const skills = teamEntries.map(e => e.driverSkill);
    const totalSkill = skills.reduce((sum, skill) => sum + skill, 0);

    return {
        teamNumber,
        teamName: teamEntries[0].teamName,
        totalEntries: teamEntries.length,
        averageDriverSkill: Math.round((totalSkill / teamEntries.length) * 10) / 10,
        highestSkill: Math.max(...skills),
        lowestSkill: Math.min(...skills),
        lastScoutDate: teamEntries[0].date,
        allEntries: teamEntries
    };
};

export const getUniqueTeams = (entries: ScoutEntry[]): Array<{ teamNumber: string; teamName: string }> => {
    const uniqueTeamsMap = new Map<string, string>();

    entries.forEach(entry => {
        if (!uniqueTeamsMap.has(entry.teamNumber)) {
            uniqueTeamsMap.set(entry.teamNumber, entry.teamName);
        }
    });

    return Array.from(uniqueTeamsMap.entries()).map(([teamNumber, teamName]) => ({
        teamNumber,
        teamName
    })).sort((a, b) => a.teamNumber.localeCompare(b.teamNumber));
};
