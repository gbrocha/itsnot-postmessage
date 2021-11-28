export type FunctionToChain = ((...args: unknown[]) => void) | undefined | null

export interface ChainedFunctionCreator {
  (...funcs: FunctionToChain[]): (...args: unknown[]) => void
}
