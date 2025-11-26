import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistService, tableService } from '../../services/restaurant';
import { Clock, UserPlus, Trash2, X } from 'lucide-react';

const WaitlistPage = () => {
  const queryClient = useQueryClient();

  const { data: waitlist, isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: () => waitlistService.getAll()
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getAll()
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => waitlistService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries(['waitlist'])
  });

  const convertMutation = useMutation({
    mutationFn: ({ id, tableId }) => waitlistService.convert(id, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries(['waitlist']);
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['tables']);
    }
  });

  const availableTables = (tables || []).filter(t => t.status === 'disponible');

  if (isLoading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Liste d'attente</h1>
          <p className="text-gray-500">{(waitlist || []).filter(w => w.status === 'en attente').length} personnes en attente</p>
        </div>
      </div>

      <div className="space-y-4">
        {(!waitlist || waitlist.length === 0) ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune personne en attente</p>
          </div>
        ) : (
          waitlist.map((entry, index) => (
            <div key={entry._id} className={`bg-white rounded-lg shadow p-4 ${entry.status !== 'en attente' ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 text-red-600 h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{entry.customerName}</h3>
                    <p className="text-sm text-gray-500">{entry.customerPhone}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>{entry.numberOfGuests} personnes</span>
                      <span>{new Date(entry.requestedDate).toLocaleDateString()} a {entry.requestedTime}</span>
                    </div>
                    {entry.notes && <p className="text-sm text-gray-500 mt-1">Notes: {entry.notes}</p>}
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      entry.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                      entry.status === 'confirme' ? 'bg-green-100 text-green-800' :
                      entry.status === 'annule' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{entry.status}</span>
                  </div>
                </div>
                {entry.status === 'en attente' && (
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          convertMutation.mutate({ id: entry._id, tableId: e.target.value });
                        }
                      }}
                      className="text-sm border rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>Convertir...</option>
                      {availableTables.filter(t => t.capacity >= entry.numberOfGuests).map(t => (
                        <option key={t._id} value={t._id}>Table {t.tableNumber} ({t.capacity}p)</option>
                      ))}
                    </select>
                    <button onClick={() => cancelMutation.mutate(entry._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Annuler">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WaitlistPage;
