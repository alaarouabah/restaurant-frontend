import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService, tableService, waitlistService, orderService } from '../../services/restaurant';
import { Users, Calendar, Clock, ChefHat, XCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const [showConvertModal, setShowConvertModal] = useState(null);

  const { data: reservations, isLoading: loadingRes } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationService.getAll(),
    refetchInterval: 30000
  });

  const { data: tables, isLoading: loadingTables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getAll(),
    refetchInterval: 10000
  });

  const { data: waitlist, isLoading: loadingWait } = useQuery({
    queryKey: ['waitlist'],
    queryFn: () => waitlistService.getAll(),
    refetchInterval: 10000
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
    refetchInterval: 15000
  });

  const convertMutation = useMutation({
    mutationFn: ({ id, tableId }) => waitlistService.convert(id, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries(['waitlist']);
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['tables']);
      setShowConvertModal(null);
    }
  });

  const cancelWaitlistMutation = useMutation({
    mutationFn: (id) => waitlistService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries(['waitlist'])
  });

  const isLoading = loadingRes || loadingTables || loadingWait || loadingOrders;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayReservations = (reservations || []).filter(r => {
    const today = new Date().toDateString();
    return new Date(r.reservationDate).toDateString() === today;
  });

  const activeWaitlist = (waitlist || []).filter(w => w.status === 'en attente');
  const availableTables = (tables || []).filter(t => t.status === 'disponible');
  const activeOrders = (orders || []).filter(o => !['payée', 'annulée'].includes(o.status));

  const stats = [
    { label: 'Reservations du jour', value: todayReservations.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Tables disponibles', value: availableTables.length + '/' + (tables || []).length, icon: Users, color: 'bg-green-500' },
    { label: 'Liste d attente', value: activeWaitlist.length, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Commandes en cours', value: activeOrders.length, icon: ChefHat, color: 'bg-red-500' }
  ];

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getTableColor = (status) => {
    if (status === 'disponible') return 'bg-green-100 border-green-500 text-green-700';
    if (status === 'occupée') return 'bg-red-100 border-red-500 text-red-700';
    if (status === 'réservée') return 'bg-blue-100 border-blue-500 text-blue-700';
    if (status === 'hors-service') return 'bg-gray-100 border-gray-400 text-gray-500';
    return 'bg-gray-100 border-gray-300 text-gray-600';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={stat.color + ' p-3 rounded-full'}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Liste d Attente
              {activeWaitlist.length > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {activeWaitlist.length}
                </span>
              )}
            </h2>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {activeWaitlist.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun client en attente</p>
            ) : (
              <div className="space-y-3">
                {activeWaitlist.map((entry, idx) => (
                  <div key={entry._id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 text-yellow-800 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium">{entry.customerName}</p>
                          <p className="text-sm text-gray-500">{entry.customerPhone}</p>
                          <div className="flex gap-2 mt-1 text-xs text-gray-500">
                            <span>{entry.numberOfGuests} pers.</span>
                            <span>-</span>
                            <span>{formatTime(entry.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {availableTables.filter(t => t.capacity >= entry.numberOfGuests).length > 0 && (
                          <button
                            onClick={() => setShowConvertModal(entry)}
                            className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            title="Assigner une table"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => cancelWaitlistMutation.mutate(entry._id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Annuler"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Etat des Tables</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {(tables || []).map(table => (
                <div key={table._id} className={'border-2 rounded-lg p-2 text-center ' + getTableColor(table.status)}>
                  <div className="font-bold">{table.tableNumber}</div>
                  <div className="text-xs">{table.capacity}p</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs justify-center flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Disponible</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Occupée</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> Réservée</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded"></span> Hors-service</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Reservations Aujourd hui</h2>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {todayReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune reservation aujourd hui</p>
            ) : (
              <div className="space-y-2">
                {todayReservations.slice(0, 5).map(res => (
                  <div key={res._id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{res.customerName}</p>
                      <p className="text-sm text-gray-500">{res.reservationTime} - {res.numberOfGuests} pers.</p>
                    </div>
                    <span className={'text-xs px-2 py-1 rounded ' + (
                      res.status === 'confirmée' ? 'bg-green-100 text-green-700' :
                      res.status === 'arrivée' ? 'bg-blue-100 text-blue-700' :
                      res.status === 'en attente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Commandes en Cours</h2>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {activeOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune commande en cours</p>
            ) : (
              <div className="space-y-2">
                {activeOrders.slice(0, 5).map(order => {
                  const statusColors = {
                    'en attente': 'bg-yellow-100 text-yellow-700',
                    'en préparation': 'bg-blue-100 text-blue-700',
                    'prête': 'bg-green-100 text-green-700',
                    'servie': 'bg-purple-100 text-purple-700'
                  };
                  return (
                    <div key={order._id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Table {order.table?.tableNumber || '-'}</p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} article(s) - {(order.total || 0).toFixed(2)} EUR</p>
                      </div>
                      <span className={'text-xs px-2 py-1 rounded ' + (statusColors[order.status] || 'bg-gray-100')}>
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Assigner une table</h2>
            <p className="text-gray-600 mb-4">
              Client: <strong>{showConvertModal.customerName}</strong><br />
              Personnes: <strong>{showConvertModal.numberOfGuests}</strong>
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableTables
                .filter(t => t.capacity >= showConvertModal.numberOfGuests)
                .map(table => (
                  <button
                    key={table._id}
                    onClick={() => convertMutation.mutate({ id: showConvertModal._id, tableId: table._id })}
                    className="w-full p-3 border rounded hover:bg-green-50 hover:border-green-500 text-left flex justify-between"
                  >
                    <span>Table {table.tableNumber}</span>
                    <span className="text-gray-500">{table.capacity} places - {table.location}</span>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setShowConvertModal(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
