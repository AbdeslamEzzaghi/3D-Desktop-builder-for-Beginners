
'use client';

import React, { createContext, useState, useContext, useMemo, ReactNode, useCallback } from 'react';

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

const INITIAL_TESTS: Omit<TestResult, 'passed'>[] = [
    { id: 1, name: "L’unité centrale s’allume", points: 2, conditions: ["Connectée à la multiprise", "Multiprise connectée à la prise murale"] },
    { id: 2, name: "L’écran fonctionne", points: 2, conditions: ["Connecté à l’unité centrale (HDMI)", "Alimenté via multiprise"] },
    { id: 3, name: "Je peux écrire un texte", points: 1, conditions: ["Clavier connecté via USB à l’unité centrale"] },
    { id: 4, name: "Je peux cliquer et déplacer la souris", points: 1, conditions: ["Souris connectée via USB à l’unité centrale"] },
    { id: 5, name: "Je peux imprimer un document", points: 2, conditions: ["Imprimante connectée en USB à l’unité centrale", "Alimentée via multiprise"] },
    { id: 6, name: "Je peux enregistrer un son", points: 1, conditions: ["Micro connecté à la prise jack de l’unité centrale"] },
    { id: 7, name: "Je peux écouter de la musique", points: 2, conditions: ["Haut-parleur ou casque connecté à la prise jack"] },
];

type ConnectionContextType = {
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  testResults: TestResult[];
  checkAllTests: () => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>(
    INITIAL_TESTS.map(t => ({...t, passed: false}))
  );

  const checkAllTests = useCallback(() => {
    const newResults = INITIAL_TESTS.map(test => {
      let passed = false;
      switch (test.id) {
        case 1:
          const powerStripToWall = connections.some(c => c.from === 'power-strip' && c.to === 'wall' && c.type === 'power');
          const towerToStrip = connections.some(c => c.from === 'central-unit' && c.to === 'power-strip' && c.type === 'power');
          passed = powerStripToWall && towerToStrip;
          break;
        case 2:
          const monitorToTower = connections.some(c => c.from === 'monitor' && c.to === 'central-unit' && c.portType === 'hdmi');
          const monitorToStrip = connections.some(c => c.from === 'monitor' && c.to === 'power-strip' && c.type === 'power');
          passed = monitorToTower && monitorToStrip;
          break;
        case 3:
          passed = connections.some(c => c.from === 'keyboard' && c.to === 'central-unit' && c.portType === 'usb');
          break;
        case 4:
          passed = connections.some(c => c.from === 'mouse' && c.to === 'central-unit' && c.portType === 'usb');
          break;
        case 5:
          const printerToTower = connections.some(c => c.from === 'printer' && c.to === 'central-unit' && c.portType === 'usb');
          const printerToStrip = connections.some(c => c.from === 'printer' && c.to === 'power-strip' && c.type === 'power');
          passed = printerToTower && printerToStrip;
          break;
        case 6:
          passed = connections.some(c => c.from === 'mic' && c.to === 'central-unit' && c.portType === 'mic-in');
          break;
        case 7:
          const speakersToTower = connections.some(c => c.from === 'speakers' && c.to === 'central-unit' && c.portType === 'audio-out');
          const headphonesToTower = connections.some(c => c.from === 'headphones' && c.to === 'central-unit' && c.portType === 'audio-out');
          passed = speakersToTower || headphonesToTower;
          break;
      }
      return { ...test, passed };
    });
    setTestResults(newResults);
  }, [connections]);

  const value = useMemo(() => ({
    connections,
    setConnections,
    testResults,
    checkAllTests,
  }), [connections, testResults, checkAllTests]);

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
