import { ChainedFunctionCreator } from './types'

export const createChainedFunction: ChainedFunctionCreator = (...funcs) => {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) {
        return acc
      }

      if (typeof func !== 'function') {
        console.error(
          'Hero: Invalid argument type - must only provide functions, undefined, or null.',
        )
      }

      return function chainedFunction(...args) {
        acc.apply(this, args)
        func.apply(this, args)
      }
    },
    () => {},
  )
}
