import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ScoutForm } from "./components/ScoutForm";
import { ScoutList } from "./components/ScoutList";
import { TeamComparison } from "./components/TeamComparison";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { Admin } from "./Admin";
import { useAuth } from "./hooks/useAuth";
import { useScout } from "./hooks/useScout";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "dark";
  });

  const [activeTab, setActiveTab] = useState<"scout" | "compare">("scout");
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const { profile, firebaseUser, logout, loading: authLoading } = useAuth();
  const {
    entries,
    addEntry,
    updateEntry,
    removeEntry,
    loading: scoutLoading,
    error: scoutError,
  } = useScout(undefined, !!profile || showAdmin);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Enable transitions after initial mount to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("theme-transitions-enabled");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleEditClick = (entry: any) => {
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isLoggedIn={!!profile}
        username={profile ? `${profile.name} ${profile.surname}` : ""}
        onLogout={logout}
      />

      <div className="container mt-4">
        {showAdmin ? (
          <Admin
            entries={entries}
            onDeleteEntry={removeEntry}
            onEditEntry={handleEditClick}
            onClose={() => setShowAdmin(false)}
            error={scoutError}
          />
        ) : !profile && !firebaseUser ? (
          <div className="mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Login />
              </div>
            </div>
          </div>
        ) : (
          <>
            {!profile && firebaseUser ? (
              <div className="alert alert-warning">
                <h4>Profil Bilgisi Bulunamadı</h4>
                <p>
                  Oturum açıldı ({firebaseUser.email ?? "E-posta yok"}) ancak
                  profil verileriniz Firestore'a yazılamadı. Lütfen Firebase
                  Console -&gt; Firestore -&gt; Rules kısmından yazma izinlerini
                  kontrol edin.
                </p>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={logout}
                >
                  Çıkış Yap ve Tekrar Dene
                </button>
              </div>
            ) : (
              <>
                {/* Tab Navigation */}
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "scout" ? "active" : ""}`}
                      onClick={() => setActiveTab("scout")}
                    >
                      📝 Scout
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "compare" ? "active" : ""}`}
                      onClick={() => setActiveTab("compare")}
                    >
                      📊 Karşılaştır
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                {activeTab === "scout" ? (
                  <div className="row">
                    <div className="col-lg-4 mb-4">
                      <ScoutForm
                        key={editingEntry ? editingEntry.id : "new-entry"}
                        onAdd={addEntry}
                        onUpdate={updateEntry}
                        initialData={editingEntry}
                        onCancelEdit={handleCancelEdit}
                        currentUser={
                          profile
                            ? `${profile.name} ${profile.surname}`
                            : firebaseUser?.email || "Bilinmiyor"
                        }
                      />
                    </div>

                    <div className="col-lg-8">
                      {scoutLoading ? (
                        <div className="text-center p-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          ></div>
                        </div>
                      ) : (
                        <ScoutList
                          entries={
                            profile?.role === "admin" || showAdmin
                              ? entries
                              : entries.filter(
                                  (e) =>
                                    e.scoutName ===
                                    (profile
                                      ? `${profile.name} ${profile.surname}`
                                      : ""),
                                )
                          }
                          onDelete={removeEntry}
                          onEdit={handleEditClick}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <TeamComparison
                    entries={
                      profile?.role === "admin" || showAdmin
                        ? entries
                        : entries.filter(
                            (e) =>
                              e.scoutName ===
                              (profile
                                ? `${profile.name} ${profile.surname}`
                                : ""),
                          )
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer onAdminClick={() => setShowAdmin(true)} />
    </>
  );
}

export default App;
