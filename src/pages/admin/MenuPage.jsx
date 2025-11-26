import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../../services/restaurant';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const MenuPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'plat principal',
    image: '', preparationTime: 15, ingredients: '', allergens: '',
    calories: '', spicyLevel: 0, isSpecial: false
  });

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data) => menuService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      closeModal();
    },
    onError: (err) => alert('Erreur: ' + (err.response?.data?.message || err.message))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => menuService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => menuService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['menu'])
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => menuService.toggleAvailability(id),
    onSuccess: () => queryClient.invalidateQueries(['menu'])
  });

  const categories = ['entrée', 'plat principal', 'dessert', 'boisson', 'vin', 'cocktail', 'café'];
  const filtered = (menuItems || []).filter(item => categoryFilter === 'all' || item.category === categoryFilter);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        image: item.image || '',
        preparationTime: item.preparationTime || 15,
        ingredients: (item.ingredients || []).join(', '),
        allergens: (item.allergens || []).join(', '),
        calories: item.calories || '',
        spicyLevel: item.spicyLevel || 0,
        isSpecial: item.isSpecial || false
      });
    } else {
      setEditItem(null);
      setForm({ name: '', description: '', price: '', category: 'plat principal', image: '', preparationTime: 15, ingredients: '', allergens: '', calories: '', spicyLevel: 0, isSpecial: false });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      calories: form.calories ? parseInt(form.calories) : undefined,
      ingredients: form.ingredients ? form.ingredients.split(',').map(i => i.trim()).filter(Boolean) : [],
      allergens: form.allergens ? form.allergens.split(',').map(a => a.trim()).filter(Boolean) : []
    };
    if (editItem) {
      updateMutation.mutate({ id: editItem._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion du Menu</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          <Plus className="h-5 w-5" /> Nouveau Plat
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1 rounded ${categoryFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Tous ({(menuItems || []).length})
        </button>
        {categories.map(cat => {
          const count = (menuItems || []).filter(i => i.category === cat).length;
          return (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 rounded capitalize ${categoryFilter === cat ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item._id} className={`bg-white rounded-lg shadow overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
            {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{item.category}</span>
                  {item.isSpecial && <span className="ml-1 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">Spécial</span>}
                </div>
                <span className="font-bold text-red-600">{item.price.toFixed(2)} €</span>
              </div>
              {item.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>}
              <div className="flex flex-wrap gap-1 mb-2">
                {(item.allergens || []).slice(0, 3).map(a => (
                  <span key={a} className="text-xs bg-orange-100 text-orange-700 px-1 rounded">{a}</span>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-1">
                  <button onClick={() => openModal(item)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(item._id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => toggleMutation.mutate(item._id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {item.available ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {item.available ? 'Disponible' : 'Indisponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center text-gray-500 py-8">Aucun plat dans cette catégorie</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editItem ? 'Modifier' : 'Nouveau'} Plat</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded px-3 py-2" rows="2" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded px-3 py-2">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Temps prép. (min)</label>
                  <input type="number" value={form.preparationTime} onChange={e => setForm({...form, preparationTime: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Calories</label>
                  <input type="number" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ingrédients (séparés par virgule)</label>
                <input type="text" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergènes (séparés par virgule)</label>
                <input type="text" value={form.allergens} onChange={e => setForm({...form, allergens: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="gluten, lait, oeufs..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau épicé (0-3)</label>
                  <input type="number" min="0" max="3" value={form.spicyLevel} onChange={e => setForm({...form, spicyLevel: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex items-center pt-6">
                  <input type="checkbox" checked={form.isSpecial} onChange={e => setForm({...form, isSpecial: e.target.checked})} className="mr-2" />
                  <label className="text-sm">Plat du jour / Spécial</label>
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

export default MenuPage;
