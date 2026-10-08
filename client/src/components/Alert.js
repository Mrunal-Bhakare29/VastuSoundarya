const Alert = ({ type = 'success', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  if (!message) return null;

  return (
    <div className={`p-4 rounded-sm border mb-4 flex justify-between items-center ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
