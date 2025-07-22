
'use client';

import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';

// This file is now simplified. It only provides a basic context shell if needed elsewhere,
// but the primary state management for connections is lifted up to main-layout.tsx.

export type Connection = {
  from: string; // device id, e.g., 'monitor'
  to: string;   // device id, e.g., 'central-unit' or 'power-strip'
  type: string; // 'power' or 'data'
  portType: string; // 'hdmi', 'usb', 'power-strip-outlet', etc.
};

type TestResult = {
  id: number;
  name: string;
  passed: boolean;
  points: number;
  conditions: string[];
};

type ConnectionContextType = {
  // The context is kept for now in case other parts of the app use it,
  // but it's no longer the source of truth for connection tests.
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};
