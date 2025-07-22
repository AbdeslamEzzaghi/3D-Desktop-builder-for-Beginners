
'use client';

import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { useSorting } from './sorting-context';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, TestTube2 } from 'lucide-react';
import { ConnectionTest } from './connection-test';
import type { Connection } from './connection-context';

export function SortingTest({ connections }: { connections: Connection[] }) {
  const { checkAnswers, results, allComponents } = useSorting();

  const { correctCount, totalCount, isTestComplete } = useMemo(() => {
    const totalComponents = allComponents.length;
    if (totalComponents === 0) {
      return { correctCount: 0, totalCount: 0, isTestComplete: false };
    }
    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const isTestComplete = correctCount === totalComponents;
    return { correctCount, totalCount: totalComponents, isTestComplete };
  }, [results, allComponents]);

  const hasBeenTested = Object.values(results).some(r => r !== null);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-md font-semibold mb-2 flex items-center gap-2"><TestTube2 className="h-5 w-5" />Test 1: Tri des périphériques</h3>
        <p className="text-sm text-muted-foreground">
          Après avoir trié les composants dans l'onglet "Composants", cliquez sur "Vérifier" pour voir votre résultat.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={checkAnswers} size="sm" disabled={allComponents.length === 0}>Vérifier le tri</Button>
        {hasBeenTested && (
             <p className="font-semibold text-green-500">Note : {correctCount} / {totalCount}</p>
        )}
      </div>
      
      {hasBeenTested && (
        <div className="pt-2">
            <div className="mt-2">
            {isTestComplete ? (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Félicitations !</AlertTitle>
                <AlertDescription>
                  Vous avez correctement trié tous les composants. Vous pouvez maintenant les glisser sur la scène 3D depuis l'onglet "Composants".
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Résultat du test</AlertTitle>
                <AlertDescription>
                  Certains composants ne sont pas dans la bonne catégorie. Retournez à l'onglet "Composants" pour corriger vos erreurs (en rouge).
                </AlertDescription>
              </Alert>
            )}
            </div>
        </div>
      )}

      <div className="pt-8 space-y-4">
        <h3 className="text-md font-semibold mb-2 flex items-center gap-2"><TestTube2 className="h-5 w-5" />Test 2: Connexions des appareils</h3>
        <p className="text-sm text-muted-foreground">
          Connectez les appareils sur la scène 3D. Ce test vérifie si les branchements sont corrects pour que l'ordinateur soit fonctionnel.
        </p>
        <ConnectionTest connections={connections} />
      </div>
    </div>
  );
}
