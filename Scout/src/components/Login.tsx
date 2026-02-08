import React, { useState } from 'react';
import logo from '../assets/itobot-logo.jpg';

interface LoginProps {
    onLogin: (username: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isRegister) {
            // Mock registration
            if (!username.trim() || password.length < 4) {
                setError('Kullanıcı adı ve şifre (en az 4 karakter) zorunludur.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Şifreler uyuşmuyor.');
                return;
            }

            // Simulating save to local storage (in real app, this would be an API call)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find((u: any) => u.username === username)) {
                setError('Bu kullanıcı adı zaten alınmış.');
                return;
            }

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            setIsRegister(false);
            setPassword('');
            setConfirmPassword('');
        } else {
            // Mock authentication
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            // Default user for testing
            if (username === 'itobot' && password === '1234') {
                onLogin(username);
                return;
            }

            const user = users.find((u: any) => u.username === username && u.password === password);
            if (user) {
                onLogin(username);
            } else {
                setError('Geçersiz kullanıcı adı veya şifre.');
            }
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="ITOBOT" className="mb-3" style={{ height: '60px', borderRadius: '10px' }} />
                    <h2 className="fw-bold">{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
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
                        <label className="form-label">Kullanıcı Adı</label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0">
                                <i className="bi bi-person"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="itobot"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
                        {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </form>

                <div className="mt-2 text-center">
                    {!isRegister ? (
                        <>
                            <small className="text-muted d-block mb-2">
                                Şifrenizi mi unuttunuz? <span className="text-primary" style={{ cursor: 'pointer' }}>Yöneticinize danışın</span>
                            </small>
                            <hr className="my-3" />
                            <p className="mb-0">
                                Hesabınız yok mu?{' '}
                                <span
                                    className="text-primary fw-bold"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setIsRegister(true);
                                        setError('');
                                    }}
                                >
                                    Hesap Oluştur
                                </span>
                            </p>
                        </>
                    ) : (
                        <p className="mb-0">
                            Zaten hesabınız var mı?{' '}
                            <span
                                className="text-primary fw-bold"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setIsRegister(false);
                                    setError('');
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
