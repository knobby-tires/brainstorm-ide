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

let wasmModule: any = null;

export async function initWasm() {
    if (wasmModule) return;
    
    try {
        console.log("Attempting to load WASM module...");
        const module = await import('@/wasm/brainfuck_compiler');
        console.log("Module imported:", module);
        
        if (module.default) {
            console.log("Initializing module...");
            await module.default();
            console.log("Module initialized");
        }
        
        wasmModule = module;
        console.log("WASM module loaded successfully");
    } catch (err) {
        console.error("Failed to load WASM module:", err);
        throw err;
    }
}

export async function compileAndRun(code: string): Promise<ExecutionResult> {
    console.log("Starting compile and run...");
    if (!wasmModule) {
        console.log("No WASM module found, initializing...");
        await initWasm();
    }
    
    if (!wasmModule) {
        throw new Error("Failed to initialize WASM module");
    }

    const result = wasmModule.compile_and_run(code);
    return {
        output: result.output(),
        memory: result.memory(),
        pointer: result.pointer(),
        error: result.error() || null,
        stats: {
            instruction_count: result.stats().instruction_count(),
            loop_depth: result.stats().loop_depth(),
            instruction_counts: new Map(result.stats().instruction_counts()),
            loop_iterations: new Map(result.stats().loop_iterations()),
        }
    };
}