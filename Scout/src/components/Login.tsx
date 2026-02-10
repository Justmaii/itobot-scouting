import React, { useState } from "react";
import logo from "../assets/itobot-logo.jpg";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Şifreler uyuşmuyor.");
          return;
        }
        if (password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır.");
          return;
        }

        await register(email, password, name, surname);
        setSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        await login(email, password);
        // The useAuth hook will handle the state change in App.tsx
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError(
          "Bu e-posta adresi zaten kullanımda. Eğer az önce kayıt olmaya çalıştıysanız, internet veya izin hatası nedeniyle profiliniz tam oluşturulamamış olabilir. Lütfen giriş yapmayı deneyin veya farklı bir e-posta kullanın.",
        );
      } else if (
        err.code === "permission-denied" ||
        err.message?.includes("permissions")
      ) {
        setError(
          "Firebase izin hatası! Lütfen Firebase Console üzerinden Security Rules ayarlarını güncelleyin (adım adım rehber implementasyon planında mevcut).",
        );
      } else {
        setError(err.message || "Bir hata oluştu.");
      }
    }
  };

  return (
    <div
      className="login-container d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="ITOBOT"
            className="mb-3"
            style={{ height: "60px", borderRadius: "10px" }}
          />
          <h2 className="fw-bold">{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h2>
          <p className="text-muted">6038 Scouting Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 px-3 small mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2 px-3 small mb-3">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="name@itobot.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Ad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Soyad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Soyad"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <div className="mb-4">
              <label className="form-label">Şifre Tekrar</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? "İşleniyor..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-2 text-center">
          {!isRegister ? (
            <>
              <small className="text-muted d-block mb-2">
                Şifrenizi mi unuttunuz?{" "}
                <span className="text-primary" style={{ cursor: "pointer" }}>
                  Yöneticinize danışın
                </span>
              </small>
              <hr className="my-3" />
              <p className="mb-0">
                Hesabınız yok mu?{" "}
                <span
                  className="text-primary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                  }}
                >
                  Hesap Oluştur
                </span>
              </p>
            </>
          ) : (
            <p className="mb-0">
              Zaten hesabınız var mı?{" "}
              <span
                className="text-primary fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
              >
                Giriş Yap
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
