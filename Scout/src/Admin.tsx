import React, { useState } from "react";
import type { ScoutEntry } from "./types/index";
import { Timestamp } from "firebase/firestore";

interface AdminProps {
  entries: ScoutEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: ScoutEntry) => void;
  onClose: () => void;
  error?: string | null;
}

const ADMIN_HASH =
  "128ce4ab1692bf56c640ee9fe851d6265f5a2b0192a670b1cf933f2eb8a65a48";

async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
const formatFirebaseTimestamp = (timestamp: Timestamp | string): string => {
  if (!timestamp) return "-";
  if (typeof timestamp === "string") return timestamp;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString("tr-TR");
  }
  // Fallback for plain object with seconds
  if (typeof timestamp === "object" && "seconds" in timestamp) {
    const ts = timestamp as { seconds: number; nanoseconds: number };
    return new Date(ts.seconds * 1000).toLocaleString("tr-TR");
  }
  return "-";
};

export const Admin = ({
  entries,
  onDeleteEntry,
  onEditEntry,
  onClose,
  error: fetchError,
}: AdminProps) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  // ... (rest of the component state)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const hashedInput = await sha256(password);
      if (hashedInput === ADMIN_HASH) {
        setIsAdminAuthenticated(true);
        setError("");
      } else {
        setError("Hatalı şifre!");
      }
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `scouting_data_${new Date().toISOString()}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const stats = {
    totalEntries: entries.length,
    teams: Array.from(new Set(entries.map((e) => e.teamNumber))),
    bestDriver: entries.reduce(
      (prev, current) =>
        prev.driverSkill > current.driverSkill ? prev : current,
      entries[0],
    ),
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Kontrol Ediliyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </button>
              <button
                type="button"
                className="btn btn-link text-muted"
                onClick={onClose}
              >
                İptal
              </button>
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

      {fetchError && (
        <div className="alert alert-danger shadow-sm mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Veri Çekme Hatası:</strong> {fetchError}
          <p className="small mb-0 mt-1">
            Firebase izinlerini veya internet bağlantınızı kontrol edin.
          </p>
        </div>
      )}

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
              <h3>{stats.bestDriver ? stats.bestDriver.teamNumber : "N/A"}</h3>
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
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatFirebaseTimestamp(entry.date)}</td>
                <td>
                  <strong>{entry.teamNumber}</strong>
                </td>
                <td>{entry.matchNumber}</td>
                <td>{entry.scoutName}</td>
                <td>
                  <span
                    className={`badge ${entry.driverSkill > 7 ? "bg-success" : entry.driverSkill > 4 ? "bg-warning" : "bg-danger"}`}
                  >
                    {entry.driverSkill}/10
                  </span>
                </td>
                <td>
                  <div
                    className="small text-muted"
                    style={{ maxWidth: "250px" }}
                  >
                    {entry.autonomousNotes && (
                      <div>
                        <strong>Auto:</strong> {entry.autonomousNotes}
                      </div>
                    )}
                    {entry.teleopNotes && (
                      <div>
                        <strong>Tele:</strong> {entry.teleopNotes}
                      </div>
                    )}
                    {entry.generalNotes && (
                      <div>
                        <strong>Gen:</strong> {entry.generalNotes}
                      </div>
                    )}
                    {!entry.autonomousNotes &&
                      !entry.teleopNotes &&
                      !entry.generalNotes && <span>-</span>}
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
                        if (
                          window.confirm(
                            "Bu kaydı silmek istediğinizden emin misiniz?",
                          )
                        ) {
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
