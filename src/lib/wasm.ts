import * as wasm from '@/wasm/brainfuck_compiler';

interface ExecutionStats {
    instruction_count: number;
    loop_depth: number;
    instruction_counts: Map<string, number>;
    loop_iterations: Map<number, number>;
}

interface ExecutionResult {
    output: string;
    memory: Uint8Array;
    pointer: number;
    error: string | null;
    stats: ExecutionStats;
}

let wasmModule: WebAssembly.Instance | null = null;

export async function initWasm(): Promise<WebAssembly.Instance> {
    if (wasmModule) return wasmModule;

    try {
        console.log("Attempting to load WASM module...");
        
        // Get the compiled WebAssembly module
        const buffer = await fetch('@/wasm/brainfuck_compiler.wasm');
        const bytes = await buffer.arrayBuffer();
        const module = new WebAssembly.Module(bytes);

        // Create an instance of the module
        const instance = new WebAssembly.Instance(module, {});

        wasmModule = instance;
        console.log("WASM module loaded successfully");
        return instance;
    } catch (err) {
        console.error("Failed to load WASM module:", err);
        throw err;
    }
}

export async function compileAndRun(code: string): Promise<ExecutionResult> {
    console.log("Starting compile and run...");
    
    if (!wasmModule) {
        await initWasm();
    }

    // Ensure the module is initialized before accessing exports
    if (!wasmModule) {
        throw new Error("Failed to initialize WASM module");
    }

    // Access the WebAssembly function with proper typing
    const compileAndRunFunc = wasmModule.exports.compile_and_run as (code: string) => ExecutionResult;

    const result = compileAndRunFunc(code);
    return {
        output: result.output,
        memory: result.memory,
        pointer: result.pointer,
        error: result.error || null,
        stats: {
            instruction_count: result.stats.instruction_count,
            loop_depth: result.stats.loop_depth,
            instruction_counts: new Map(result.stats.instruction_counts),
            loop_iterations: new Map(result.stats.loop_iterations),
        },
    };
}