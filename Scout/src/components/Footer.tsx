
export const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-5 border-top border-secondary">
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="text-uppercase mb-4 fw-bold text-primary">6038 ITOBOT</h5>
                        <p className="small text-white-50">
                            FRC Team 6038 ITOBOT Scout - Robot performanslarını analiz etmek,
                            maç verilerini toplamak ve stratejik kararlar almak için geliştirilmiştir.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-instagram fs-5"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-twitter-x fs-5"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-youtube fs-5"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="bi bi-github fs-5"></i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="text-uppercase mb-4 fw-bold">Bağlantılar</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none d-flex align-items-center">
                                    <i className="bi bi-chevron-right small me-2"></i> Ana Sayfa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none d-flex align-items-center">
                                    <i className="bi bi-chevron-right small me-2"></i> Maç Listesi
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none d-flex align-items-center">
                                    <i className="bi bi-chevron-right small me-2"></i> İstatistikler
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none d-flex align-items-center">
                                    <i className="bi bi-chevron-right small me-2"></i> Takım Hakkında
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-4">
                        <h5 className="text-uppercase mb-4 fw-bold">İletişim</h5>
                        <div className="mb-3 d-flex align-items-start">
                            <i className="bi bi-geo-alt me-3 text-primary fs-5"></i>
                            <span className="text-white-50">Ataköy 7-8-9-10. Kısım Mah. Çobançeşme E-5 Yan Yol Cad., Bakırköy/İstanbul</span>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                            <i className="bi bi-envelope me-3 text-primary fs-5"></i>
                            <span className="text-white-50">info@itobot6038.com</span>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                            <i className="bi bi-telephone me-3 text-primary fs-5"></i>
                            <span className="text-white-50">+90 555 123 45 67</span>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-secondary opacity-25" />

                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="small text-white-50 mb-0">
                            &copy; {new Date().getFullYear()} <strong>6038 ITOBOT</strong>. Tüm hakları saklıdır.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <span className="small text-white-50">
                            Developed by <span className="text-white fw-bold">ITOBOT Software Team</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
