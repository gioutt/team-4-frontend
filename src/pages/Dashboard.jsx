import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [users, setUsers] = useState([]);

    // Estado del espacio para admin
    const [newSpace, setNewSpace] = useState({ name: '', capacity: 10, description: '' });

    useEffect(() => {
        fetchReservations();
        if (user.role === 'admin') {
            fetchSpaces();
            fetchUsers();
        }
    }, [user]);

    const fetchReservations = async () => {
        try {
            const endpoint = user.role === 'admin' ? '/reservations' : '/reservations?mine=true';
            const { data } = await api.get(endpoint);
            setReservations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSpaces = async () => {
        try {
            const { data } = await api.get('/spaces');
            setSpaces(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`)) return;
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || 'Error al actualizar el rol');
        }
    };

    const handleCancelReservation = async (id) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reservación?')) return;
        try {
            await api.delete(`/reservations/${id}`);
            fetchReservations();
        } catch (e) {
            alert(e.response?.data?.message || 'Error al cancelar');
        }
    };

    const handleApproveReservation = async (id) => {
        if (!confirm('¿Estás seguro de que deseas aprobar esta reservación?')) return;
        try {
            await api.put(`/reservations/${id}`, { status: 'confirmed' });
            fetchReservations();
        } catch (e) {
            alert(e.response?.data?.message || 'Error al aprobar');
        }
    };

    const handleCreateSpace = async (e) => {
        e.preventDefault();
        try {
            await api.post('/spaces', newSpace);
            setNewSpace({ name: '', capacity: 10, description: '' });
            fetchSpaces();
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || 'Error al crear espacio');
        }
    };

    const handleDeleteSpace = async (id) => {
        if (!confirm('¿Eliminar este espacio?')) return;
        try {
            await api.delete(`/spaces/${id}`);
            fetchSpaces();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Panel de Control <span className="text-sm font-normal text-gray-500">(Rol: {user.role})</span>
            </h1>

            {/* Sección Admin: Administrar Espacios y Usuarios */}
            {user.role === 'admin' && (
                <>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Administrar Espacios</h2>
                        <form onSubmit={handleCreateSpace} className="flex gap-4 mb-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" value={newSpace.name} onChange={e => setNewSpace({ ...newSpace, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                                <input type="number" value={newSpace.capacity} onChange={e => setNewSpace({ ...newSpace, capacity: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
                            </div>
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <input type="text" value={newSpace.description} onChange={e => setNewSpace({ ...newSpace, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Agregar Espacio</button>
                        </form>

                        <ul className="divide-y divide-gray-200">
                            {spaces.map(space => (
                                <li key={space.id} className="py-4 flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{space.name}</p>
                                        <p className="text-sm text-gray-500">{space.description} (Capacidad: {space.capacity})</p>
                                    </div>
                                    <button onClick={() => handleDeleteSpace(space.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Administrar Usuarios</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Actual</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.id !== user.id ? (
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        <option value="user">Usuario</option>
                                                        <option value="admin">Administrador</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Tú</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Lista de Reservaciones */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{user.role === 'admin' ? 'Todas las Reservas' : 'Mis Reservas'}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
                                {user.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map(res => (
                                <tr key={res.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.space?.name}</td>
                                    {user.role === 'admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.user?.name}</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.start_time).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.end_time).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${res.status === 'confirmed' ? 'bg-green-100 text-green-800' : res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendiente' : res.status === 'cancelled' ? 'Cancelado' : res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'admin' && res.status === 'pending' && (
                                            <button onClick={() => handleApproveReservation(res.id)} className="text-green-600 hover:text-green-900 mr-4 font-semibold">Aprobar</button>
                                        )}
                                        <button onClick={() => handleCancelReservation(res.id)} className="text-red-600 hover:text-red-900 font-semibold">{user.role === 'admin' && res.status === 'pending' ? 'Rechazar' : 'Cancelar'}</button>
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No se encontraron reservaciones.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
