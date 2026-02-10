import { useState, useEffect, useCallback } from "react";
import {
  addScoutEntry,
  getAllScoutEntries,
  getScoutEntriesByUser,
  updateScoutEntry,
  deleteScoutEntry,
} from "../services/scoutService";
import { type ScoutEntry } from "../types";

export const useScout = (scoutName?: string, enabled: boolean = true) => {
  const [entries, setEntries] = useState<ScoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      let data: ScoutEntry[];
      if (scoutName) {
        data = await getScoutEntriesByUser(scoutName);
      } else {
        data = await getAllScoutEntries();
      }
      setEntries(data);
      setError(null);
    } catch (err) {
      setError("Entries could not be fetched.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [scoutName]);

  useEffect(() => {
    if (enabled) {
      fetchEntries();
    }
  }, [fetchEntries, enabled]);

  const addEntry = async (entry: Omit<ScoutEntry, "id">) => {
    try {
      const id = await addScoutEntry(entry);
      await fetchEntries(); // Refresh list
      return id;
    } catch (err) {
      setError("Failed to add entry.");
      throw err;
    }
  };

  const updateEntry = async (id: string, entry: Partial<ScoutEntry>) => {
    try {
      await updateScoutEntry(id, entry);
      await fetchEntries(); // Refresh list
    } catch (err) {
      setError("Failed to update entry.");
      throw err;
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await deleteScoutEntry(id);
      await fetchEntries(); // Refresh list
    } catch (err) {
      setError("Failed to delete entry.");
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    removeEntry,
    refreshEntries: fetchEntries,
  };
};
