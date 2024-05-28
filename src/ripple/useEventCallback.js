import { useRef, useLayoutEffect, useEffect } from 'react'

const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useEventCallback = (fn) => {
  const ref = useRef(fn)
  useEnhancedEffect(() => {
    ref.current = fn
  }, [fn])
  return useRef((...args) => (0, ref.current)(...args)).current
}
