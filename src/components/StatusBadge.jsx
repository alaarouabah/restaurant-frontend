const StatusBadge = ({ status, type = 'default' }) => {
  const statusStyles = {
    // Reservations
    'confirm\u00e9e': 'bg-green-100 text-green-800',
    'en attente': 'bg-yellow-100 text-yellow-800',
    'arriv\u00e9e': 'bg-blue-100 text-blue-800',
    'termin\u00e9e': 'bg-gray-100 text-gray-800',
    'annul\u00e9e': 'bg-red-100 text-red-800',
    'no-show': 'bg-red-100 text-red-800',
    
    // Tables
    'disponible': 'bg-green-100 text-green-800',
    'occup\u00e9e': 'bg-red-100 text-red-800',
    'r\u00e9serv\u00e9e': 'bg-blue-100 text-blue-800',
    'hors-service': 'bg-gray-100 text-gray-800',
    
    // Orders
    'en pr\u00e9paration': 'bg-orange-100 text-orange-800',
    'pr\u00eate': 'bg-purple-100 text-purple-800',
    'servie': 'bg-teal-100 text-teal-800',
    'pay\u00e9e': 'bg-green-100 text-green-800',
    
    // Waitlist
    'notifi\u00e9': 'bg-blue-100 text-blue-800',
    'confirm\u00e9': 'bg-green-100 text-green-800',
    'expir\u00e9': 'bg-gray-100 text-gray-800',
    'annul\u00e9': 'bg-red-100 text-red-800',
    
    // Default
    'default': 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize \}>
      {status}
    </span>
  );
};

export default StatusBadge;
