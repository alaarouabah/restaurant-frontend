import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService, tableService } from '../../services/restaurant';
import { Plus, Edit, Trash2, Check, X, Clock } from 'lucide-react';

const ReservationsPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    numberOfGuests: 2, reservationDate: '', reservationTime: '19:00',
    table: '', occasion: 'autre', specialRequests: ''
  });

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationService.getAll()
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data) => reservationService.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['reservations']); closeModal(); },
    onError: (err) => alert('Erreur: ' + (err.response?.data?.message || err.message))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => reservationService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['reservations']); closeModal(); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reservationService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['reservations'])
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => reservationService.cancel(id, 'Annulé par admin'),
    onSuccess: () => queryClient.invalidateQueries(['reservations'])
  });

  const arrivedMutation = useMutation({
    mutationFn: (id) => reservationService.markArrived(id),
    onSuccess: () => queryClient.invalidateQueries(['reservations'])
  });

  const completedMutation = useMutation({
    mutationFn: (id) => reservationService.markCompleted(id),
    onSuccess: () => queryClient.invalidateQueries(['reservations'])
  });

  const statuses = ['confirmée', 'en attente', 'arrivée', 'terminée', 'annulée', 'no-show'];
  const occasions = ['anniversaire', 'business', 'rendez-vous', 'famille', 'autre'];
  
  const statusColors = {
    'confirmée': 'bg-green-100 text-green-800',
    'en attente': 'bg-yellow-100 text-yellow-800',
    'arrivée': 'bg-blue-100 text-blue-800',
    'terminée': 'bg-gray-100 text-gray-800',
    'annulée': 'bg-red-100 text-red-800',
    'no-show': 'bg-orange-100 text-orange-800'
  };

  const filtered = (reservations || []).filter(r => statusFilter === 'all' || r.status === statusFilter);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerEmail: item.customerEmail || '',
        numberOfGuests: item.numberOfGuests,
        reservationDate: item.reservationDate?.split('T')[0] || '',
        reservationTime: item.reservationTime,
        table: item.table?._id || item.table || '',
        occasion: item.occasion || 'autre',
        specialRequests: item.specialRequests || ''
      });
    } else {
      setEditItem(null);
      setForm({ customerName: '', customerPhone: '', customerEmail: '', numberOfGuests: 2, reservationDate: '', reservationTime: '19:00', table: '', occasion: 'autre', specialRequests: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, table: form.table || undefined };
    if (editItem) {
      updateMutation.mutate({ id: editItem._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const getTableNumber = (table) => {
    if (!table) return '-';
    if (typeof table === 'object') return table.tableNumber;
    const t = (tables || []).find(x => x._id === table);
    return t ? t.tableNumber : '-';
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          <Plus className="h-5 w-5" /> Nouvelle Réservation
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded ${statusFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Toutes ({(reservations || []).length})
        </button>
        {statuses.map(s => {
          const count = (reservations || []).filter(r => r.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded ${statusFilter === s ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date/Heure</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Personnes</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Table</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(res => (
              <tr key={res._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{res.customerName}</div>
                  <div className="text-xs text-gray-500">{res.customerPhone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{formatDate(res.reservationDate)}</div>
                  <div className="text-xs text-gray-500">{res.reservationTime}</div>
                </td>
                <td className="px-4 py-3 text-sm">{res.numberOfGuests} pers.</td>
                <td className="px-4 py-3 text-sm">Table {getTableNumber(res.table)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[res.status] || 'bg-gray-100'}`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {res.status === 'confirmée' && (
                      <button onClick={() => arrivedMutation.mutate(res._id)} className="p-1 text-gray-400 hover:text-blue-600" title="Marquer arrivé">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {res.status === 'arrivée' && (
                      <button onClick={() => completedMutation.mutate(res._id)} className="p-1 text-gray-400 hover:text-green-600" title="Terminer">
                        <Clock className="h-4 w-4" />
                      </button>
                    )}
                    {!['annulée', 'terminée', 'no-show'].includes(res.status) && (
                      <button onClick={() => cancelMutation.mutate(res._id)} className="p-1 text-gray-400 hover:text-orange-600" title="Annuler">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => openModal(res)} className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(res._id)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">Aucune réservation</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editItem ? 'Modifier' : 'Nouvelle'} Réservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone *</label>
                  <input type="tel" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input type="date" value={form.reservationDate} onChange={e => setForm({...form, reservationDate: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure *</label>
                  <input type="time" value={form.reservationTime} onChange={e => setForm({...form, reservationTime: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Personnes *</label>
                  <input type="number" min="1" max="20" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Occasion</label>
                  <select value={form.occasion} onChange={e => setForm({...form, occasion: e.target.value})} className="w-full border rounded px-3 py-2">
                    {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Table</label>
                  <select value={form.table} onChange={e => setForm({...form, table: e.target.value})} className="w-full border rounded px-3 py-2">
                    <option value="">-- Attribution automatique --</option>
                    {(tables || []).filter(t => t.status === 'disponible' || (editItem && editItem.table?._id === t._id)).map(t => (
                      <option key={t._id} value={t._id}>Table {t.tableNumber} ({t.capacity}p)</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Demandes spéciales</label>
                  <textarea value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} className="w-full border rounded px-3 py-2" rows="2" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
