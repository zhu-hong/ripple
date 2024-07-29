import { useRef, useEffect } from 'react'

export const useEventCallback = (fn) => {
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  }, [fn])
  return useRef((...args) => (0, ref.current)(...args)).current
}
