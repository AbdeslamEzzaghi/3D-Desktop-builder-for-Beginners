
'use client';

import React, { useMemo } from 'react';
import { useConnections } from './connection-context';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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

export function ConnectionTest() {
  const { testResults, checkAllTests } = useConnections();

  const totalPoints = useMemo(() => {
    return testResults.reduce((acc, test) => acc + (test.passed ? test.points : 0), 0);
  }, [testResults]);

  const maxPoints = useMemo(() => {
    return testResults.reduce((acc, test) => acc + test.points, 0);
  }, [testResults]);

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
