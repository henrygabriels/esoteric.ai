import React from 'react';
import { ConvertKitForm } from '@/components/ConvertKitForm';

export default function ArchiveSubscribePage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="text-xs text-gray-500 mb-2 font-mono">
            [ARCHIVE ACCESS]
          </div>
          <div className="text-xl text-gray-300 font-mono tracking-wide">
            esoteric.ai
          </div>
        </div>

        <div className="space-y-6">
          <div className="font-mono text-xs text-gray-400">
            &gt; ARCHIVE QUERY RESPONSE REQUEST
          </div>
          
          <div className="font-mono text-xs text-gray-500 leading-relaxed">
            &gt; your query will be processed when server load permits
            <br/>&gt; results will be transmitted via secure channel
            <br/>&gt; awaiting contact details...
          </div>
          
          <div className="font-mono text-[10px] text-gray-600">
            &gt; Note: Your email will be used to deliver query results and related patterns.
            <br/>&gt; Response time: 24-48 hours
            <br/>&gt; Protocol: Secure, Unmonitored, Discrete
          </div>

          <div className="mt-8">
            <ConvertKitForm formId="archive-subscription-form" />
          </div>
        </div>
      </div>
    </div>
  );
} 