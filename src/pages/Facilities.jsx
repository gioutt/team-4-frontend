import { ShieldAlert, BookOpen, Monitor, MonitorUp } from 'lucide-react';
import useBase64Image from '../hooks/useBase64Image';

const FacilityCard = ({ facility }) => {
    const { imageUrl } = useBase64Image(facility.imageFilename);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col">
            <div className="h-48 overflow-hidden bg-gray-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={facility.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Cargando...
                    </div>
                )}
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-3">
                    {facility.icon}
                    <h2 className="text-2xl font-bold ml-3 text-gray-800">{facility.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{facility.description}</p>

                <div className="mt-auto bg-white rounded-lg p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">Horarios Disponibles</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                        <li>
                            <span className="font-medium text-gray-700">Para Clases:</span> {facility.schedules.class}
                        </li>
                        <li>
                            <span className="font-medium text-gray-700">Extracurriculares:</span> {facility.schedules.extracurricular}
                        </li>
                        <li>
                            <span className="font-medium text-gray-700">Uso Personal:</span> {facility.schedules.personal}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Facilities = () => {
    const facilitiesData = [
        {
            id: 1,
            name: "Sala de Cómputo",
            imageFilename: "computo.png",
            description: "Espacios de trabajo equipados con equipos de escritorio, acceso a internet de alta velocidad y software especializado para clases de programación, diseño y más.",
            schedules: {
                class: "Lunes a Viernes: 7:00 AM - 5:00 PM (Máx. 2 hrs)",
                extracurricular: "Lunes a Viernes: 5:00 PM - 6:00 PM",
                personal: "Lunes a Viernes: 7:00 AM - 6:00 PM (Máx. 1 hr)"
            },
            icon: <Monitor className="w-8 h-8 text-blue-500" />
        },
        {
            id: 2,
            name: "Laboratorio",
            imageFilename: "laboratorioRobotica.png",
            description: "Áreas especializadas para prácticas electrónicas, redes y desarrollo de hardware.",
            schedules: {
                class: "Lunes a Viernes: 7:00 AM - 5:00 PM (Máx. 2 hrs)",
                extracurricular: "No disponible",
                personal: "No disponible"
            },
            icon: <MonitorUp className="w-8 h-8 text-green-500" />
        },
        {
            id: 3,
            name: "Biblioteca",
            imageFilename: "biblioteca.png",
            description: "Espacios de lectura tranquilos con acervo bibliográfico especializado en ingeniería y tecnología.",
            schedules: {
                class: "No aplicable",
                extracurricular: "No disponible",
                personal: "Lunes a Viernes: 7:00 AM - 6:00 PM (Máx. 1 hr)"
            },
            icon: <BookOpen className="w-8 h-8 text-yellow-600" />
        },
        {
            id: 4,
            name: "Auditorio",
            imageFilename: "auditorio.png",
            description: "Espacio amplio para conferencias, foros y presentaciones masivas. Requiere autorización explícita de un administrador.",
            schedules: {
                class: "Previa Autorización",
                extracurricular: "Previa Autorización",
                personal: "No disponible"
            },
            icon: <ShieldAlert className="w-8 h-8 text-red-500" />
        }
    ];

    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                Conoce Nuestras <span className="text-[#D4AF37]">Instalaciones</span>
            </h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                La Facultad cuenta con diferentes espacios designados para favorecer tu aprendizaje académico, desarrollo extracurricular y actividades profesionales.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facilitiesData.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                ))}
            </div>
        </div>
    );
};

export default Facilities;
