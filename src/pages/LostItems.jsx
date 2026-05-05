import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function LostItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [formData, setFormData] = useState({ space_id: '', title: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resItems, resSpaces] = await Promise.all([
        api.get('/lost-items'),
        api.get('/spaces')
      ]);
      setItems(resItems.data);
      setSpaces(resSpaces.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lost-items', formData);
      setMessage('Publicación creada correctamente.');
      setFormData({ space_id: '', title: '', description: '' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error al crear la publicación.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/lost-items/${id}`, { status });
      fetchData();
    } catch (err) {
      alert("Error al actualizar el estado");
    }
  };

  const handleToggleArchive = async (item) => {
    const isArchived = item.status === 'archived';
    const mensaje = isArchived 
      ? "¿Quieres volver a mostrar este objeto en el foro?" 
      : "¿Estás seguro de archivar este objeto? Ya no será visible para los alumnos.";
    
    if (!window.confirm(mensaje)) return;

    try {
      const newStatus = isArchived ? 'searching' : 'archived';
      await api.put(`/lost-items/${item.id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar de la base de datos permanentemente? Esto no se puede deshacer.")) return;
    try {
      await api.delete(`/lost-items/${id}`);
      fetchData();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">Foro de Objetos Perdidos</h1>
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reportar Objeto (Perdido o Encontrado)</h2>
        {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Qué objeto es?</label>
              <input type="text" required maxLength="100" placeholder="Ej. Termo azul, Gafas..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Dónde fue?</label>
              <select required value={formData.space_id} onChange={e => setFormData({...formData, space_id: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                <option value="">Selecciona un espacio...</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Detalles adicionales</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows="2"></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 font-bold">Publicar en el foro</button>
        </form>
      </div>

      {/* Listado de Objetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div key={item.id} className={`bg-white p-5 shadow rounded-xl border border-gray-100 flex flex-col justify-between ${item.status === 'archived' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                  item.status === 'searching' ? 'bg-red-100 text-red-800' : 
                  item.status === 'stored' ? 'bg-green-100 text-green-800' : 
                  item.status === 'archived' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 'searching' && 'Buscando'}
                  {item.status === 'stored' && 'En Almacén'}
                  {item.status === 'returned' && 'Entregado'}
                  {item.status === 'archived' && 'Archivado'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{item.description}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Ubicación:</strong> {item.space?.name}</p>
            </div>

            <div className="border-t pt-3 mt-3">
              <p className="text-[10px] text-gray-400 mb-3">Publicado por: {item.user?.name}</p>
              {user?.role === 'admin' && (
                <div className="flex items-center gap-3">
                  {item.status === 'searching' && (
                    <button onClick={() => handleUpdateStatus(item.id, 'stored')} className="text-blue-600 hover:underline text-xs font-medium">
                      Almacenar
                    </button>
                  )}
                  {item.status !== 'returned' && (
                    <button onClick={() => handleToggleArchive(item)} className="text-gray-500 hover:text-purple-600 text-xs font-medium">
                      {item.status === 'archived' ? 'Desarchivar' : 'Archivar'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="ml-auto bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-600 hover:text-white transition-colors">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-center col-span-2 py-10">No hay objetos reportados en este momento.</p>}
      </div>
    </div>
  );
}