import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
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
  timestamp: string | Timestamp;
  ownerUid?: string;
  date: string | Timestamp;
}
