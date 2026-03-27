import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useBase64Image from '../hooks/useBase64Image';

const Home = () => {
    const { user } = useAuth();
    const { imageUrl: facultadUrl } = useBase64Image('facultad.png');
    const { imageUrl: salaUrl } = useBase64Image('sala.png');
    const { imageUrl: laboratorioUrl } = useBase64Image('laboratorio.png');

    return (
        <div className="text-center mt-20">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Bienvenido a <span className="text-[#D4AF37]">Reservaciones FDI</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Reserva tus espacios favoritos fácilmente y administra tus reservaciones en un solo lugar.
            </p>

            <div className="mt-8 mb-8 flex justify-center">
                {facultadUrl ? (
                    <img
                        src={facultadUrl}
                        alt="Facultad FDI"
                        className="max-w-full h-auto rounded-lg shadow-md lg:max-w-2xl md:max-w-lg sm:max-w-md"
                    />
                ) : <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>}
            </div>

            <div className="mb-8 flex justify-center">
                {salaUrl ? (
                    <img
                        src={salaUrl}
                        alt="Sala FDI"
                        className="max-w-full h-auto rounded-lg shadow-md lg:max-w-2xl md:max-w-lg sm:max-w-md"
                    />
                ) : <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>}
            </div>

            <div className="mb-8 flex justify-center">
                {laboratorioUrl ? (
                    <img
                        src={laboratorioUrl}
                        alt="Laboratorio FDI"
                        className="max-w-full h-auto rounded-lg shadow-md lg:max-w-2xl md:max-w-lg sm:max-w-md"
                    />
                ) : <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>}
            </div>

            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                    <Link to={user ? "/dashboard" : "/login"} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1E2843] hover:bg-slate-800 md:py-4 md:text-lg md:px-10">
                        Comenzar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
