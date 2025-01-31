// wasm.ts
import init, { compile_and_run } from '../wasm/brainfuck_compiler';

interface ExecutionResult {
    output: string;
    memory: Uint8Array;
    pointer: number;
    error: string | null;
}

let initialized = false;

export async function initWasm(): Promise<void> {
    if (initialized) return;
    
    try {
        await init();
        initialized = true;
    } catch (err) {
        console.error("Failed to initialize WASM:", err);
        throw err;
    }
}

export async function compileAndRun(code: string): Promise<ExecutionResult> {
    if (!initialized) {
        await initWasm();
    }
    
    const result = compile_and_run(code);
    return {
        output: result.output,
        memory: result.memory,
        pointer: result.pointer,
        error: result.error || null
    };
}