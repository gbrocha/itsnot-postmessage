import { useRef, useState, useEffect, useCallback } from 'react'
import { UseControlled } from './types'

export const useControlled: UseControlled = ({
  controlled,
  default: defaultProp,
  name,
  state = 'value',
}) => {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const isControlled = useRef(controlled !== undefined)
  const [valueState, setValue] = useState(defaultProp)
  const value = isControlled.current ? controlled : valueState

  useEffect(() => {
    if (isControlled.current !== (controlled !== undefined)) {
      console.error(
        [
          `Hero: A component is changing the ${
            isControlled.current ? '' : 'un'
          }controlled ${state} state of ${name} to be ${
            isControlled.current ? 'un' : ''
          }controlled.`,
          'Elements should not switch from uncontrolled to controlled (or vice versa).',
          `Decide between using a controlled or uncontrolled ${name} ` +
            'element for the lifetime of the component.',
          "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
          'More info: https://fb.me/react-controlled-components',
        ].join('\n'),
      )
    }
  }, [state, name, controlled])

  const defaultValue = useRef(defaultProp)

  useEffect(() => {
    if (!isControlled.current && defaultValue.current !== defaultProp) {
      console.error(
        [
          `Hero: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
            `To suppress this warning opt to use a controlled ${name}.`,
        ].join('\n'),
      )
    }
  }, [defaultProp, state, name])

  const setValueIfUncontrolled = useCallback(newValue => {
    if (!isControlled.current) {
      setValue(newValue)
    }
  }, [])

  return [value, setValueIfUncontrolled]
}
