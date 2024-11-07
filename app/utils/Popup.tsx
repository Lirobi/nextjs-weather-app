import { createRoot } from "react-dom/client";
import AlertLevel from "../lib/definitions/AlertLevel";
import PopupTemplate from "../components/PopupTemplate";

interface DisplayPopupProps {
    alertLevel: AlertLevel;
    message: string;
    duration: number;
}


function Popup({alertLevel, message, duration}: DisplayPopupProps) {

    const popup = document.createElement('div');
    const root = createRoot(popup);
    root.render(<PopupTemplate alertLevel={alertLevel} message={message} />);

    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
        root.unmount();
    }, duration);
    return; 

}

export default Popup;