import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [formData, setFormData] = useState({ space_id: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resReports, resSpaces] = await Promise.all([
        api.get('/reports'),
        api.get('/spaces')
      ]);
      setReports(resReports.data);
      setSpaces(resSpaces.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports', formData);
      setMessage('Reporte enviado correctamente.');
      setFormData({ space_id: '', description: '' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error al enviar el reporte.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const note = prompt("Añadir nota de resolución (opcional):", "Revisado por administrador");
      if (note === null) return; 
      await api.put(`/reports/${id}`, { status, adminNote: note });
      fetchData();
    } catch (err) {
      alert("Error al actualizar el estado");
    }
  };

  const handleToggleArchiveReport = async (report) => {
    const isArchived = report.status === 'archived';
    const mensaje = isArchived 
      ? "¿Deseas restaurar este reporte para que sea visible nuevamente?" 
      : "¿Estás seguro de archivar este reporte? Se ocultará de la lista del usuario.";
    
    if (!window.confirm(mensaje)) return;

    try {
      const newStatus = isArchived ? 'pending' : 'archived';
      await api.put(`/reports/${report.id}`, { 
        status: newStatus, 
        adminNote: isArchived ? "Reporte restaurado" : "Ticket archivado por limpieza" 
      });
      fetchData();
    } catch (err) {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este ticket de la base de datos permanentemente? Esto no se puede deshacer.")) return;
    try {
      await api.delete(`/reports/${id}`);
      fetchData();
    } catch (err) {
      alert("Error al eliminar el reporte");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Reportes de Mantenimiento</h1>
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generar un Nuevo Reporte</h2>
        {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Instalación afectada</label>
            <select required value={formData.space_id} onChange={e => setFormData({...formData, space_id: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              <option value="">Selecciona un espacio...</option>
              {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción del problema</label>
            <textarea required minLength="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows="3" placeholder="Ej. El aire acondicionado de la Sala 4 no enciende..."></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold">Enviar Reporte</button>
        </form>
      </div>
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tickets Actuales</h2>
        <div className="space-y-4">
          {reports.map(r => (
            <div key={r.id} className={`border-l-4 p-4 rounded bg-gray-50 transition-all ${r.status === 'archived' ? 'border-purple-400 opacity-75' : 'border-blue-500'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{r.space?.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                  {r.adminNote && <p className="text-sm text-blue-600 mt-2 italic font-medium">Nota del Admin: {r.adminNote}</p>}
                  <p className="text-[10px] text-gray-400 mt-3">Reportado por: {r.user?.name}</p>
                </div>
                
                <div className="text-right mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full uppercase mb-4 ${
                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    r.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                    r.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {r.status === 'pending' && 'Pendiente'}
                    {r.status === 'resolved' && 'Completado'}
                    {r.status === 'rejected' && 'Rechazado'}
                    {r.status === 'archived' && 'Archivado'}
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleUpdateStatus(r.id, 'resolved')} className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-green-600 transition-colors">
                          Resolver
                        </button>
                        <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-red-600 transition-colors">
                          Rechazar
                        </button>
                      </div>
                      
                      <div className="flex gap-3 justify-end items-center border-t pt-2 border-gray-200">
                        <button onClick={() => handleToggleArchiveReport(r)} className="text-gray-500 hover:text-purple-600 text-[10px] font-medium underline decoration-dotted">
                          {r.status === 'archived' ? 'Restaurar' : 'Archivar'}
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-700 text-[10px] font-bold">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && <p className="text-gray-500 text-center py-10">No hay reportes de mantenimiento activos.</p>}
        </div>
      </div>
    </div>
  );
}