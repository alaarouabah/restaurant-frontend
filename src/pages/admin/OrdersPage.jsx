import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, tableService, menuService } from '../../services/restaurant';
import { Plus, Eye, Printer, CheckCircle } from 'lucide-react';

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ table: '', customerName: '', customerPhone: '', items: [] });
  const [itemSearch, setItemSearch] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll()
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getAll()
  });

  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      setShowModal(false);
      setForm({ table: '', customerName: '', customerPhone: '', items: [] });
    },
    onError: (err) => alert('Erreur: ' + (err.response?.data?.message || err.message))
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['orders'])
  });

  const statuses = ['en attente', 'en préparation', 'prête', 'servie', 'payée', 'annulée'];
  const statusColors = {
    'en attente': 'bg-yellow-100 text-yellow-800',
    'en préparation': 'bg-blue-100 text-blue-800',
    'prête': 'bg-green-100 text-green-800',
    'servie': 'bg-purple-100 text-purple-800',
    'payée': 'bg-gray-100 text-gray-800',
    'annulée': 'bg-red-100 text-red-800'
  };

  const filtered = (orders || []).filter(o => statusFilter === 'all' || o.status === statusFilter);
  const availableMenu = (menuItems || []).filter(m => m.available && m.name.toLowerCase().includes(itemSearch.toLowerCase()));

  const addItem = (menuItem) => {
    const existing = form.items.find(i => i.menuItem === menuItem._id);
    if (existing) {
      setForm({
        ...form,
        items: form.items.map(i => i.menuItem === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i)
      });
    } else {
      setForm({
        ...form,
        items: [...form.items, { menuItem: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: 1 }]
      });
    }
    setItemSearch('');
  };

  const updateQuantity = (idx, qty) => {
    if (qty <= 0) {
      setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
    } else {
      setForm({ ...form, items: form.items.map((item, i) => i === idx ? { ...item, quantity: qty } : item) });
    }
  };

  const calculateTotal = () => form.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      table: form.table || undefined,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      items: form.items.map(i => ({ menuItem: i.menuItem, quantity: i.quantity, notes: i.notes }))
    };
    createMutation.mutate(data);
  };

  const getTableNumber = (tableRef) => {
    if (!tableRef) return '-';
    if (typeof tableRef === 'object' && tableRef.tableNumber) return tableRef.tableNumber;
    const table = (tables || []).find(t => t._id === tableRef);
    return table ? table.tableNumber : '-';
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          <Plus className="h-5 w-5" /> Nouvelle Commande
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded ${statusFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Toutes ({(orders || []).length})
        </button>
        {statuses.map(s => {
          const count = (orders || []).filter(o => o.status === s).length;
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Table</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Articles</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((order, idx) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-medium">Table {getTableNumber(order.table)}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-sm">{order.items?.length || 0} article(s)</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600">{(order.total || 0).toFixed(2)} €</td>
                <td className="px-4 py-3">
                  <select 
                    value={order.status} 
                    onChange={e => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                    className={`text-xs px-2 py-1 rounded border-0 ${statusColors[order.status] || 'bg-gray-100'}`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setViewOrder(order)} className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Printer className="h-4 w-4" />
                    </button>
                    {order.status !== 'payée' && (
                      <button 
                        onClick={() => updateStatusMutation.mutate({ id: order._id, status: 'payée' })}
                        className="p-1 text-gray-400 hover:text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">Aucune commande</div>
        )}
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nouvelle Commande</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Table</label>
                <select value={form.table} onChange={e => setForm({...form, table: e.target.value})} className="w-full border rounded px-3 py-2">
                  <option value="">-- Sans table --</option>
                  {(tables || []).filter(t => t.status === 'disponible' || t.status === 'occupée').map(t => (
                    <option key={t._id} value={t._id}>Table {t.tableNumber} ({t.capacity}p - {t.location})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom Client *</label>
                  <input type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone *</label>
                  <input type="tel" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ajouter un article</label>
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={itemSearch} 
                  onChange={e => setItemSearch(e.target.value)} 
                  className="w-full border rounded px-3 py-2"
                />
                {itemSearch && availableMenu.length > 0 && (
                  <div className="mt-1 border rounded max-h-32 overflow-y-auto">
                    {availableMenu.slice(0, 5).map(m => (
                      <button 
                        key={m._id} 
                        type="button" 
                        onClick={() => addItem(m)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex justify-between"
                      >
                        <span>{m.name}</span>
                        <span className="text-red-600">{m.price.toFixed(2)} €</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {form.items.length > 0 && (
                <div className="border rounded p-3">
                  <h4 className="font-medium mb-2">Articles</h4>
                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b last:border-0">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => updateQuantity(idx, item.quantity - 1)} className="w-6 h-6 bg-gray-200 rounded">-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(idx, item.quantity + 1)} className="w-6 h-6 bg-gray-200 rounded">+</button>
                        <span className="ml-2 text-red-600">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => {setShowModal(false); setForm({ table: '', customerName: '', customerPhone: '', items: [] });}} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={form.items.length === 0} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Détails Commande</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Table:</span><span>{getTableNumber(viewOrder.table)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Client:</span><span>{viewOrder.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tél:</span><span>{viewOrder.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Statut:</span><span className={`px-2 py-1 rounded text-xs ${statusColors[viewOrder.status]}`}>{viewOrder.status}</span></div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Articles</h4>
                {viewOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.menuItem?.name || 'Article'} x{item.quantity}</span>
                    <span>{((item.menuItem?.price || 0) * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span>Sous-total:</span><span>{(viewOrder.subtotal || 0).toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>TVA:</span><span>{(viewOrder.tax || 0).toFixed(2)} €</span></div>
                {viewOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Remise:</span><span>-{viewOrder.discount.toFixed(2)} €</span></div>}
                <div className="flex justify-between font-bold text-lg"><span>Total:</span><span className="text-red-600">{(viewOrder.total || 0).toFixed(2)} €</span></div>
              </div>
            </div>
            <button onClick={() => setViewOrder(null)} className="mt-4 w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
