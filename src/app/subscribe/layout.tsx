'use client';

import React from 'react';

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <div className="fixed bottom-6 left-6">
        <a 
          href="/"
          className="font-mono text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          &gt; return to patterns
        </a>
      </div>
    </>
  );
} 