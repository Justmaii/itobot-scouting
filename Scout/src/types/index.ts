export interface UserProfile {
  uid: string;
  email: string;
  password?: string; // Optinal as we don't store it in Firestore usually
  name: string;
  surname: string;
  role: "admin" | "user";
}

export interface ScoutEntry {
  id: string;
  scoutName: string;
  teamNumber: string;
  matchNumber: string;
  teamName: string;
  driverSkill: number;
  autonomousNotes: string;
  teleopNotes: string;
  generalNotes: string;
  timestamp: string;
  date: Date;
}