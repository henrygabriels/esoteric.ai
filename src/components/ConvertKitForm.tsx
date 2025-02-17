'use client';

import React, { useEffect } from 'react';

interface ConvertKitFormProps {
  formId: string;
}

export const ConvertKitForm: React.FC<ConvertKitFormProps> = ({ formId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://esoteric-ai.kit.com/d177b2f806/index.js';
    script.async = true;
    script.setAttribute('data-uid', 'd177b2f806');
    
    // Find the container element
    const container = document.getElementById(formId);
    if (container) {
      container.appendChild(script);
    }

    return () => {
      const container = document.getElementById(formId);
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [formId]);

  return <div id={formId} className="mt-4" />;
}; 