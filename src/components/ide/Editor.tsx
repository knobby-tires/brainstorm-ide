"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { compileAndRun } from '@/lib/wasm';

interface Memory {
  cells: number[];
  pointer: number;
}

const Editor = () => {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [memory, setMemory] = useState<Memory>({
    cells: new Array(30).fill(0),
    pointer: 0
  });
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const resetMemory = () => {
    setMemory({
      cells: new Array(30).fill(0),
      pointer: 0
    });
    setOutput('');
  };

  const runCode = async () => {
    try {
        setIsRunning(true);
        setOutput('Running...');
        
        const result = await compileAndRun(code);
        console.log('Execution completed:', result);
        
        if (result.error) {
            setOutput(`Error: ${result.error}`);
        } else {
            setOutput(result.output);
            setMemory({
                cells: Array.from(result.memory),
                pointer: result.pointer
            });
        }
    } catch (error: unknown) {  
        console.error('Execution failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setOutput(`System error: ${errorMessage}`);
    } finally {
        setIsRunning(false);
    }
};

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>BrainStorm IDE</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Code Editor */}
          <div className="mb-4">
            <textarea
              className="w-full h-48 p-2 font-mono bg-slate-800 text-slate-100 rounded-md"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter your Brainfuck code here..."
              spellCheck="false"
            />
          </div>

          {/* Control Panel */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={resetMemory}
              className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Memory Visualization */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Memory State</h3>
            <div className="flex overflow-x-auto pb-2">
              {memory.cells.map((cell, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-12 h-12 border rounded-md
                    flex items-center justify-center mr-1
                    ${index === memory.pointer ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
                  `}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>

          {/* Output Console */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            <div className="bg-slate-800 text-slate-100 p-2 rounded-md min-h-24 font-mono">
              {output || 'Program output will appear here...'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editor;