import AlertLevel from "../lib/definitions/AlertLevel";

interface PopupTemplateProps {
  alertLevel: AlertLevel;
  message: string;
}

const PopupTemplate = ({ alertLevel, message }: PopupTemplateProps) => {
  const getBackgroundColor = () => {
    switch (alertLevel) {
      case AlertLevel.INFO:
        return 'bg-green-500';
      case AlertLevel.ERROR:
        return 'bg-red-500';
      case AlertLevel.WARNING:
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 ${getBackgroundColor()} text-white px-6 py-3 rounded shadow-lg`}>
      {message}
    </div>
  );
};

export default PopupTemplate;
