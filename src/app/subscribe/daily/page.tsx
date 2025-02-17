import React from 'react';
import { ConvertKitForm } from '@/components/ConvertKitForm';

export default function DailySubscribePage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="text-xs text-gray-500 mb-2 font-mono">
            [SUBSCRIPTION GATEWAY]
          </div>
          <div className="text-xl text-gray-300 font-mono tracking-wide">
            esoteric.ai
          </div>
        </div>

        <div className="space-y-6">
          <div className="font-mono text-xs text-gray-400">
            &gt; DAILY REVELATION SUBSCRIPTION
          </div>
          
          <div className="font-mono text-xs text-gray-500 leading-relaxed">
            &gt; initiating temporal bridge
            <br/>&gt; preparing daily transmission
            <br/>&gt; awaiting contact signal...
          </div>
          
          <div className="font-mono text-[10px] text-gray-600">
            &gt; Note: Your email will be used to establish a secure channel for pattern transmission.
            <br/>&gt; Transmission frequency: Daily [0000-2359 UTC]
            <br/>&gt; Protocol: Secure, Unmonitored, Discrete
          </div>

          <div className="mt-8">
            <ConvertKitForm formId="daily-subscription-form" />
          </div>
        </div>
      </div>
    </div>
  );
} 