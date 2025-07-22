
'use client';

import React, { useMemo, useState } from 'react';
import type { Connection } from './connection-context';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '../ui/badge';

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

export function ConnectionTest({ connections }: { connections: Connection[] }) {
  const [testResults, setTestResults] = useState<TestResult[]>(
    INITIAL_TESTS.map(t => ({...t, passed: false}))
  );

  const checkAllTests = () => {
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
  };

  const totalPoints = useMemo(() => {
    return testResults.reduce((acc, test) => acc + (test.passed ? test.points : 0), 0);
  }, [testResults]);

  const maxPoints = useMemo(() => {
    return INITIAL_TESTS.reduce((acc, test) => acc + test.points, 0);
  }, []);

  return (
    <div className="space-y-4">
       <div className="flex items-center gap-4">
        <Button onClick={checkAllTests} size="sm">Vérifier les connexions</Button>
        <p className="font-semibold text-lg text-primary">Score: <span className="font-bold">{totalPoints} / {maxPoints}</span></p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Conditions de réussite</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testResults.map((test) => (
              <TableRow key={test.id} className={cn(test.passed ? 'bg-green-500/10' : '')}>
                <TableCell className="text-center">
                  {test.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    <ul className="list-disc pl-4">
                        {test.conditions.map((cond, i) => <li key={i}>{cond}</li>)}
                    </ul>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={test.passed ? "default" : "secondary"} className={cn(test.passed && "bg-green-600")}>
                    {test.points} pts
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
