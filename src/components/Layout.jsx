import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Home, LayoutDashboard, Building2, Menu, X } from 'lucide-react';
import useBase64Image from '../hooks/useBase64Image';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { imageUrl: logoUrl } = useBase64Image('logo.png');
    const { imageUrl: bgUrl } = useBase64Image('fondo.png');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div
            className="min-h-screen bg-transparent flex flex-col"
            style={{
                backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <nav className="bg-[#1E2843] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-white">
                                {logoUrl && <img src={logoUrl} alt="Logo FDI" className="h-8 w-auto mr-2" />}
                                Reservaciones FDI
                            </Link>
                            {/* Enlaces de navegación - escritorio */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to="/" className="border-transparent text-gray-300 hover:border-white hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    <Home className="w-4 h-4 mr-2" /> Inicio
                                </Link>
                                <Link to="/facilities" className="border-transparent text-gray-300 hover:border-white hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    <Building2 className="w-4 h-4 mr-2" /> Instalaciones
                                </Link>
                                {user && (
                                    <>
                                        <Link to="/dashboard" className="border-transparent text-gray-300 hover:border-white hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> Panel de Control
                                        </Link>
                                        <Link to="/reservations/new" className="border-transparent text-gray-300 hover:border-white hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                            <Calendar className="w-4 h-4 mr-2" /> Nueva Reserva
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Botones de sesión - escritorio */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-white text-sm">Hola, <span className="text-[#D4AF37]">{user.name}</span></span>
                                    <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Iniciar sesión</Link>
                                    <Link to="/register" className="bg-[#E9C127] text-[#1E2843] hover:brightness-110 px-4 py-2 rounded-md text-sm font-medium font-bold">Registrarse</Link>
                                </div>
                            )}
                        </div>
                        {/* Botón hamburguesa - móvil */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-300 hover:text-white p-2 rounded-md"
                                aria-label="Abrir menú"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil desplegable */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-[#1E2843] border-t border-gray-700">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <Link to="/" onClick={closeMobileMenu} className="text-gray-300 hover:text-white hover:bg-[#2a3a5c] block px-3 py-2 rounded-md text-base font-medium">
                                <Home className="w-4 h-4 mr-2 inline" /> Inicio
                            </Link>
                            <Link to="/facilities" onClick={closeMobileMenu} className="text-gray-300 hover:text-white hover:bg-[#2a3a5c] block px-3 py-2 rounded-md text-base font-medium">
                                <Building2 className="w-4 h-4 mr-2 inline" /> Instalaciones
                            </Link>
                            {user && (
                                <>
                                    <Link to="/dashboard" onClick={closeMobileMenu} className="text-gray-300 hover:text-white hover:bg-[#2a3a5c] block px-3 py-2 rounded-md text-base font-medium">
                                        <LayoutDashboard className="w-4 h-4 mr-2 inline" /> Panel de Control
                                    </Link>
                                    <Link to="/reservations/new" onClick={closeMobileMenu} className="text-gray-300 hover:text-white hover:bg-[#2a3a5c] block px-3 py-2 rounded-md text-base font-medium">
                                        <Calendar className="w-4 h-4 mr-2 inline" /> Nueva Reserva
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="border-t border-gray-700 px-4 py-3">
                            {user ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">Hola, <span className="text-[#D4AF37]">{user.name}</span></span>
                                    <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="text-gray-300 hover:text-white flex items-center gap-2 text-sm">
                                        <LogOut className="w-4 h-4" /> Salir
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <Link to="/login" onClick={closeMobileMenu} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-center">Iniciar sesión</Link>
                                    <Link to="/register" onClick={closeMobileMenu} className="bg-[#E9C127] text-[#1E2843] hover:brightness-110 px-4 py-2 rounded-md text-sm font-medium font-bold text-center">Registrarse</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            {/* Pie de página */}
            <footer className="bg-[#8A8A8A] text-white py-3 px-4 shadow-inner mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center text-xs sm:text-sm">
                    {/* Lado izquierdo: Botón a página oficial */}
                    <div className="flex items-center xl:w-1/3 justify-center xl:justify-start order-2 xl:order-1 mt-2 xl:mt-0">
                        <a
                            href="https://fi.uacam.mx/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-transparent text-[#E9C127] font-bold hover:text-yellow-400 transition-colors whitespace-nowrap"
                        >
                            Consultar página oficial
                        </a>
                    </div>


                    <div className="text-center order-1 xl:order-2 flex-1 whitespace-nowrap">
                        <span>Universidad Autónoma de Campeche © 2026</span>
                        <br />
                        <br />
                        <span>Desarrollado por Miranda Amaro Hernández y Wilbert Novelo Ruiz</span>
                    </div>

                    {/* Lado derecho: Vacío para balance */}
                    <div className="hidden xl:block xl:w-1/3 order-3"></div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
