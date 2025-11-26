import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { waitlistService } from '../services/restaurant';
import { CalendarDays, Clock, Users, CheckCircle } from 'lucide-react';

const ReservationPage = () => {
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    numberOfGuests: 2,
    notes: ''
  });

  const reservationMutation = useMutation({
    mutationFn: (data) => waitlistService.create(data),
    onSuccess: () => setSuccess(true)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    reservationMutation.mutate({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      date: form.date,
      time: form.time,
      numberOfGuests: form.numberOfGuests,
      notes: form.notes
    });
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Demande Envoyée!</h1>
        <p className="text-gray-600 mb-8">
          Nous avons bien reçu votre demande de réservation. Nous vous contacterons pour confirmer votre table.
        </p>
        <button
          onClick={() => { setSuccess(false); setForm({ customerName: '', customerPhone: '', date: '', time: '', numberOfGuests: 2, notes: '' }); }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Réserver une Table</h1>
        <p className="text-gray-600">Remplissez le formulaire pour réserver votre table</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              value={form.customerName}
              onChange={e => setForm({...form, customerName: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={e => setForm({...form, customerPhone: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CalendarDays className="inline h-4 w-4 mr-1" /> Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline h-4 w-4 mr-1" /> Heure *
            </label>
            <select
              value={form.time}
              onChange={e => setForm({...form, time: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Sélectionner</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="19:00">19:00</option>
              <option value="19:30">19:30</option>
              <option value="20:00">20:00</option>
              <option value="20:30">20:30</option>
              <option value="21:00">21:00</option>
              <option value="21:30">21:30</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="inline h-4 w-4 mr-1" /> Nombre de personnes *
          </label>
          <select
            value={form.numberOfGuests}
            onChange={e => setForm({...form, numberOfGuests: parseInt(e.target.value)})}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'personne' : 'personnes'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Demandes spéciales
          </label>
          <textarea
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="3"
            placeholder="Allergies, occasion spéciale, etc."
          />
        </div>

        <button
          type="submit"
          disabled={reservationMutation.isPending}
          className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
          {reservationMutation.isPending ? 'Envoi en cours...' : 'Réserver'}
        </button>
      </form>
    </div>
  );
};

export default ReservationPage;
