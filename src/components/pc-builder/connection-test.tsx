
'use client';

import React, { useMemo, useState } from 'react';
import type { Connection } from './connection-context';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
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

type TestStatus = 'passed' | 'failed' | 'untested';

type TestResult = {
  id: number;
  name: string;
  status: TestStatus;
  points: number;
  conditions: string[];
};

const INITIAL_TESTS: Omit<TestResult, 'status'>[] = [
    { id: 1, name: "L’unité centrale s’allume", points: 2, conditions: ["Connectée à la multiprise (elle-même au mur)", "OU connectée directement au mur"] },
    { id: 2, name: "L’écran fonctionne", points: 2, conditions: ["Connecté à l’unité centrale (HDMI)", "Alimenté (mur ou multiprise)"] },
    { id: 3, name: "Je peux écrire un texte", points: 1, conditions: ["Clavier connecté via USB à l’unité centrale"] },
    { id: 4, name: "Je peux cliquer et déplacer la souris", points: 1, conditions: ["Souris connectée via USB à l’unité centrale"] },
    { id: 5, name: "Je peux imprimer un document", points: 2, conditions: ["Imprimante connectée en USB à l’unité centrale", "Alimentée (mur ou multiprise)"] },
    { id: 6, name: "Je peux enregistrer un son", points: 1, conditions: ["Micro connecté à l’unité centrale (USB ou Jack)"] },
    { id: 7, name: "Je peux écouter de la musique", points: 2, conditions: ["Haut-parleurs ou casque connectés à l’unité centrale"] },
];

export function ConnectionTest({ connections }: { connections: Connection[] }) {
  const [testResults, setTestResults] = useState<TestResult[]>(
    INITIAL_TESTS.map(t => ({...t, status: 'untested'}))
  );

  const checkAllTests = () => {
    const newResults = INITIAL_TESTS.map(test => {
      let passed = false;
      
      const isDevicePowered = (deviceId: string) => {
        // Direct to wall
        const isPoweredDirectly = connections.some(c => 
          c.from === deviceId && 
          c.portType === 'wall-power' && 
          c.type === 'power'
        );
        if (isPoweredDirectly) return true;
        
        // Via power strip
        const isStripPowered = connections.some(c => 
          c.from === 'power-strip' && 
          c.portType === 'wall-power' && 
          c.type === 'power'
        );
        const isDeviceOnStrip = connections.some(c => 
          c.from === deviceId && 
          c.to === 'power-strip' && 
          c.type === 'power'
        );
        return isStripPowered && isDeviceOnStrip;
      };

      const isConnectedToTower = (deviceId: string, portType?: string) => {
        return connections.some(c => 
          c.from === deviceId && 
          c.to === 'central-unit' && 
          (portType ? c.portType === portType : true)
        );
      };

      switch (test.id) {
        case 1:
          passed = isDevicePowered('central-unit');
          break;
        case 2:
          passed = isConnectedToTower('monitor', 'hdmi') && isDevicePowered('monitor');
          break;
        case 3:
          passed = isConnectedToTower('keyboard', 'usb');
          break;
        case 4:
          passed = isConnectedToTower('mouse', 'usb');
          break;
        case 5:
          passed = isConnectedToTower('printer', 'usb') && isDevicePowered('printer');
          break;
        case 6:
          passed = isConnectedToTower('mic'); // Accepts USB or Jack
          break;
        case 7:
          passed = isConnectedToTower('speakers') || isConnectedToTower('headphones');
          break;
      }
      return { ...test, status: passed ? 'passed' : 'failed' } as TestResult;
    });
    setTestResults(newResults);
  };

  const totalPoints = useMemo(() => {
    return testResults.reduce((acc, test) => acc + (test.status === 'passed' ? test.points : 0), 0);
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
              <TableRow key={test.id} className={cn(test.status === 'passed' ? 'bg-green-500/10' : '')}>
                <TableCell className="text-center">
                  {test.status === 'passed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : test.status === 'failed' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <MinusCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    <ul className="list-disc pl-4 space-y-1">
                        {test.conditions.map((cond, i) => <li key={i}>{cond}</li>)}
                    </ul>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={test.status === 'passed' ? "default" : "secondary"} className={cn(test.status === 'passed' && "bg-green-600")}>
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
