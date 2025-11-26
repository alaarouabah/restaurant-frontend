import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableService } from '../../services/restaurant';
import { Plus, Edit, Trash2 } from 'lucide-react';

const TablesPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [form, setForm] = useState({ tableNumber: '', capacity: 4, location: 'intérieur', shape: 'rectangulaire' });

  const { data: tables, isLoading, error } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data) => tableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables']);
      closeModal();
    },
    onError: (err) => {
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => tableService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['tables'])
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => tableService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['tables'])
  });

  const locations = ['intérieur', 'terrasse', 'VIP', 'bar'];
  const shapes = ['rectangulaire', 'carrée', 'ronde'];
  const statuses = ['disponible', 'occupée', 'réservée', 'hors-service'];

  const statusColors = {
    'disponible': 'bg-green-100 text-green-800',
    'occupée': 'bg-red-100 text-red-800',
    'réservée': 'bg-blue-100 text-blue-800',
    'hors-service': 'bg-gray-100 text-gray-800'
  };

  const openModal = (table = null) => {
    if (table) {
      setEditTable(table);
      setForm({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location,
        shape: table.shape || 'rectangulaire'
      });
    } else {
      setEditTable(null);
      setForm({ tableNumber: '', capacity: 4, location: 'intérieur', shape: 'rectangulaire' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTable(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, tableNumber: parseInt(form.tableNumber) };
    if (editTable) {
      updateMutation.mutate({ id: editTable._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Tables</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          <Plus className="h-5 w-5" /> Nouvelle Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(tables || []).map(table => (
          <div key={table._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold">Table {table.tableNumber}</h3>
                <p className="text-gray-500">{table.capacity} places - {table.location}</p>
                <p className="text-xs text-gray-400">{table.shape}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(table)} className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => deleteMutation.mutate(table._id)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <select
              value={table.status}
              onChange={e => statusMutation.mutate({ id: table._id, status: e.target.value })}
              className={`w-full px-3 py-2 rounded text-sm font-medium ${statusColors[table.status] || 'bg-gray-100'}`}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>

      {(tables || []).length === 0 && (
        <div className="text-center text-gray-500 py-8">Aucune table. Cliquez sur "Nouvelle Table" pour commencer.</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editTable ? 'Modifier' : 'Nouvelle'} Table</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de table *</label>
                <input
                  type="number"
                  value={form.tableNumber}
                  onChange={e => setForm({ ...form, tableNumber: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacité *</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Emplacement</label>
                <select
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Forme</label>
                <select
                  value={form.shape}
                  onChange={e => setForm({ ...form, shape: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  {createMutation.isPending || updateMutation.isPending ? 'En cours...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
