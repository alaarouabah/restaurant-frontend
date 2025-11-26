import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services/restaurant';
import { Search, Flame, Leaf, Star } from 'lucide-react';

const PublicMenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getAll()
  });

  const categories = [
    { id: 'all', label: 'Tous', icon: null },
    { id: 'entrée', label: 'Entrées', icon: null },
    { id: 'plat principal', label: 'Plats', icon: null },
    { id: 'dessert', label: 'Desserts', icon: null },
    { id: 'boisson', label: 'Boissons', icon: null },
    { id: 'vin', label: 'Vins', icon: null },
    { id: 'cocktail', label: 'Cocktails', icon: null },
    { id: 'café', label: 'Cafés', icon: null }
  ];

  const filteredItems = (menuItems || []).filter(item => {
    if (!item.available) return false;
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Menu</h1>
          <p className="text-xl text-red-100">Découvrez nos délicieux plats préparés avec passion</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {activeCategory === 'all' ? (
          // Show grouped by category
          Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 capitalize border-b pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <MenuCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show flat list
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Aucun plat trouvé</p>
            <p className="text-sm mt-2">Essayez une autre catégorie ou recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
      {item.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <div className="flex gap-1 mt-1">
              {item.isSpecial && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Chef</span>
              )}
              {item.spicyLevel > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {''.repeat(item.spicyLevel)}
                </span>
              )}
              {item.dietaryInfo?.includes('végétarien') && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> Végé
                </span>
              )}
            </div>
          </div>
          <span className="text-xl font-bold text-red-600">{item.price.toFixed(2)}€</span>
        </div>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.allergens.slice(0, 3).map(a => (
              <span key={a} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
          {item.preparationTime && <span> {item.preparationTime} min</span>}
          {item.calories && <span> {item.calories} kcal</span>}
          {item.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicMenuPage;
