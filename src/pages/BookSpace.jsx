import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const BookSpace = () => {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [purpose, setPurpose] = useState('class');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingSelection, setPendingSelection] = useState(null);
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingDuration, setBookingDuration] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSpaces();
        // Las reservaciones se cargan automáticamente cuando se selecciona un espacio
    }, []);

    const fetchSpaces = async () => {
        try {
            const { data } = await api.get('/spaces');
            setSpaces(data);
            if (data.length > 0) setSelectedSpace(data[0].id);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchReservations = async () => {
        try {
            const { data } = await api.get('/reservations');
            const calendarEvents = data.map(res => ({
                id: res.id,
                title: res.space_id == selectedSpace ? '🚫 Reservado' : 'Otro Espacio',
                start: res.start_time.replace(' ', 'T'),
                end: res.end_time.replace(' ', 'T'),
                allDay: false,
                backgroundColor: res.space_id == selectedSpace ? '#EF4444' : '#E5E7EB',
                borderColor: res.space_id == selectedSpace ? '#DC2626' : '#D1D5DB',
                textColor: res.space_id == selectedSpace ? '#ffffff' : '#374151'
            }));
            setEvents(calendarEvents);
        } catch (e) {
            console.error(e);
        }
    };

    // Cargar reservas cuando el espacio seleccionado cambia
    useEffect(() => {
        const updateEvents = async () => {
            try {
                const { data } = await api.get('/reservations');
                const calendarEvents = data
                    .filter(res => res.space_id == selectedSpace)
                    .map(res => ({
                        id: res.id,
                        title: '🚫 Reservado',
                        start: res.start_time.replace(' ', 'T'),
                        end: res.end_time.replace(' ', 'T'),
                        allDay: false,
                        backgroundColor: '#EF4444',
                        borderColor: '#DC2626',
                        textColor: '#ffffff'
                    }));
                setEvents(calendarEvents);
            } catch (e) {
                console.error(e);
            }
        };
        if (selectedSpace) updateEvents();
    }, [selectedSpace]);


    const handleDateSelect = async (selectInfo) => {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        if (!selectedSpace) {
            alert('Por favor selecciona un espacio primero. Si no hay espacios disponibles, contacta a un administrador.');
            return;
        }

        setPendingSelection({
            startStr: selectInfo.startStr,
            start: selectInfo.start
        });
        setBookingNotes('');
        setBookingDuration(1);
        setIsModalOpen(true);
    };

    const confirmReserva = async () => {
        if (!pendingSelection) return;

        try {
            const startObj = new Date(pendingSelection.start);
            const endObj = new Date(startObj.getTime() + (bookingDuration * 60 * 60 * 1000));

            const pad = (n) => n < 10 ? '0' + n : n;
            const formatLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

            const formatedStart = formatLocal(startObj);
            const formatedEnd = formatLocal(endObj);

            const response = await api.post('/reservations', {
                space_id: selectedSpace,
                start_time: formatedStart,
                end_time: formatedEnd,
                notes: bookingNotes,
                purpose: purpose
            });

            // Refrescar eventos
            const { data } = await api.get('/reservations');
            const calendarEvents = data
                .filter(res => res.space_id == selectedSpace)
                .map(res => ({
                    id: res.id,
                    title: '🚫 Reservado',
                    start: res.start_time.replace(' ', 'T'),
                    end: res.end_time.replace(' ', 'T'),
                    allDay: false,
                    backgroundColor: '#EF4444',
                    borderColor: '#DC2626',
                    textColor: '#ffffff'
                }));
            setEvents(calendarEvents);
            setIsModalOpen(false);

            if (response.data.status === 'pending') {
                alert('¡Reserva enviada! El espacio seleccionado es un Auditorio. Tu reserva está en espera de confirmación por un administrador.');
            } else {
                alert('¡Reserva exitosa! Se ha enviado un correo electrónico de confirmación.');
            }
        } catch (err) {
            const message = err.response?.data?.errors?.time?.[0] || err.response?.data?.errors?.space?.[0] || err.response?.data?.message || 'Error al hacer la reserva. ¿Conflicto de horario?';
            alert(message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Reservar un Espacio</h1>

            <div className="mb-6">
                {spaces.length === 0 ? (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                        Actualmente no hay espacios disponibles para reservar.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Espacio</label>
                            <select
                                value={selectedSpace || ''}
                                onChange={(e) => setSelectedSpace(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                            >
                                {spaces.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} (Capacidad: {s.capacity})</option>
                                ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500">
                                {spaces.find(s => s.id == selectedSpace)?.description}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Reserva</label>
                            <select
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                            >
                                <option value="class">Dar Clases</option>
                                <option value="extracurricular">Actividad Extracurricular</option>
                                <option value="personal">Uso Personal</option>
                            </select>
                            <p className="mt-2 text-xs text-gray-500">
                                {purpose === 'class' && 'Lunes a Viernes de 7am a 5pm. Máximo 2 horas.'}
                                {purpose === 'extracurricular' && 'Solo Salas de Cómputo. Lunes a Viernes de 5pm a 6pm.'}
                                {purpose === 'personal' && 'Solo Salas de Cómputo y Biblioteca. Lunes a Viernes de 7am a 6pm. Máximo 1 hora.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className='demo-app-main'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    locale={esLocale}
                    initialView='timeGridWeek'
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={events}
                    slotDuration="01:00:00"
                    snapDuration="01:00:00"
                    slotMinTime="07:00:00"
                    slotMaxTime="19:00:00"
                    allDaySlot={false}
                    expandRows={true}
                    height="auto"
                    selectAllow={(selectInfo) => selectInfo.view.type !== 'dayGridMonth'}
                    dateClick={(info) => {
                        if (info.view.type === 'dayGridMonth') {
                            const calendarApi = info.view.calendar;
                            calendarApi.changeView('timeGridDay', info.dateStr);
                        } else {
                            if (!selectedSpace) {
                                alert('Por favor selecciona un espacio primero. Si no hay espacios disponibles, contacta a un administrador.');
                                return;
                            }
                            setPendingSelection({
                                startStr: info.dateStr,
                                start: info.date
                            });
                            setBookingNotes('');
                            setBookingDuration(1);
                            setIsModalOpen(true);
                        }
                    }}
                    select={handleDateSelect}
                />
            </div>

            {/* Modal de Reservación */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90%]">
                        <h2 className="text-xl font-bold mb-4">Confirmar Reserva</h2>
                        <p className="mb-4 text-gray-600">
                            Hora de inicio: {new Date(pendingSelection.start).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duración (horas)</label>
                            <select
                                value={bookingDuration}
                                onChange={(e) => setBookingDuration(Number(e.target.value))}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                            >
                                <option value={1}>1 hora</option>
                                {purpose === 'class' && <option value={2}>2 horas</option>}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                            <textarea
                                value={bookingNotes}
                                onChange={(e) => setBookingNotes(e.target.value)}
                                className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                rows="3"
                                placeholder="Escribe un breve comentario..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmReserva}
                                className="px-4 py-2 text-sm font-medium text-[#1E2843] bg-[#E9C127] hover:brightness-110 rounded-md font-bold transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookSpace;
