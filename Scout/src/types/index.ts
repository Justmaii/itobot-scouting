import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  surname: string;
  role: "admin" | "user";
}

export interface ScoutEntry {
  scoutName: string;
  teamNumber: string;
  matchNumber: string;
  teamName: string;
  driverSkill: number;
  autonomousNotes: string;
  teleopNotes: string;
  generalNotes: string;
  timestamp: string;
  ownerUid: string;
  date: Timestamp;
}