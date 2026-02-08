export const fetchTeamName = async (teamNumber: string): Promise<string | null> => {
    // Paste your The Blue Alliance API Key here
    const API_KEY = 'WO79fIhUEHCPr7tBTPmoUEKmthwcCCe9NO2TS9vP3MGx6HaZPz8diXDX16BIpmUv';
    const BASE_URL = 'https://www.thebluealliance.com/api/v3';

    if (!teamNumber) return null;

    try {
        const response = await fetch(`${BASE_URL}/team/frc${teamNumber}`, {
            headers: {
                'X-TBA-Auth-Key': API_KEY,
            },
        });

        if (!response.ok) {
            console.error('TBA API Error:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data.nickname || data.name || null;
    } catch (error) {
        console.error('Failed to fetch team data:', error);
        return null;
    }
};
