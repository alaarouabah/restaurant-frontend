import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, MapPin, Phone, Star, ChefHat, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="bg-red-600/20 backdrop-blur-sm rounded-full p-4 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <UtensilsCrossed className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Le Gourmet</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">Restaurant Gastronomique</p>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Decouvrez une experience culinaire unique avec des plats prepares par nos chefs passionnes, 
            dans un cadre elegant et chaleureux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/menu" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold"
            >
              Decouvrir le Menu
            </Link>
            <Link 
              to="/reservation" 
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
            >
              Reserver une Table
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Nous Choisir ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une experience gastronomique inoubliable vous attend
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chefs Experts</h3>
              <p className="text-gray-600">
                Notre equipe de chefs talentueux prepare chaque plat avec passion et expertise
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ingredients Frais</h3>
              <p className="text-gray-600">
                Nous selectionnons les meilleurs produits locaux et de saison pour nos plats
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Service Attentionne</h3>
              <p className="text-gray-600">
                Notre equipe vous accueille avec le sourire pour une experience memorable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-700 rounded-2xl hover:border-red-600 transition">
              <Clock className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-4">Horaires</h3>
              <div className="text-gray-400 space-y-1">
                <p>Lundi - Samedi</p>
                <p className="text-white">12h - 14h30 | 19h - 22h30</p>
                <p className="mt-2">Dimanche</p>
                <p className="text-white">12h - 15h</p>
              </div>
            </div>
            <div className="text-center p-8 border border-gray-700 rounded-2xl hover:border-red-600 transition">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-4">Adresse</h3>
              <div className="text-gray-400 space-y-1">
                <p className="text-white">123 Rue de la Gastronomie</p>
                <p>75001 Paris</p>
                <p>France</p>
              </div>
            </div>
            <div className="text-center p-8 border border-gray-700 rounded-2xl hover:border-red-600 transition">
              <Phone className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="text-gray-400 space-y-1">
                <p className="text-white">+33 1 23 45 67 89</p>
                <p>contact@legourmet.fr</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pret a vivre une experience unique ?</h2>
          <p className="text-red-100 mb-10 text-lg">
            Reservez votre table des maintenant et laissez-vous seduire par notre cuisine raffinee
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/reservation" 
              className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-bold text-lg shadow-lg"
            >
              Reserver Maintenant
            </Link>
            <Link 
              to="/menu" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition font-semibold"
            >
              Voir le Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="h-6 w-6 text-red-500" />
            <span className="text-white font-bold text-lg">Le Gourmet</span>
          </div>
          <p className="text-sm">2025 Le Gourmet. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
