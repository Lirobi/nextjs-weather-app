import { createRoot } from 'react-dom/client';  
import React from 'react';


function DynamicComponentDisplay(container: Element, component: React.ReactNode) {
    const containerElement = document.createElement('div');
    const root = createRoot(containerElement);
    root.render(component);
    container.appendChild(containerElement);
}

export default DynamicComponentDisplay;