import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className=\"fixed inset-0 z-50 overflow-y-auto\">
      <div className=\"flex min-h-screen items-center justify-center p-4\">
        {/* Overlay */}
        <div 
          className=\"fixed inset-0 bg-black/50 transition-opacity\"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={elative bg-white rounded-xl shadow-xl w-full \ transform transition-all}>
          {/* Header */}
          <div className=\"flex items-center justify-between px-6 py-4 border-b\">
            <h3 className=\"text-lg font-semibold text-gray-900\">{title}</h3>
            <button
              onClick={onClose}
              className=\"p-1 hover:bg-gray-100 rounded-full transition-colors\"
            >
              <X className=\"h-5 w-5 text-gray-500\" />
            </button>
          </div>
          
          {/* Body */}
          <div className=\"px-6 py-4\">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
