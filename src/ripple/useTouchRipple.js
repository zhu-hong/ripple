import { useRef, useState, useMemo, useEffect, useLayoutEffect } from 'react'

const useEventCallback = (fn) => {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  }, [fn])
  return useRef((...args) => (0, ref.current)(...args)).current
}

export const useTouchRipple = (props) => {
  const { disableRipple, rippleRef } = props

  const useRippleHandler = (rippleAction, skipRippleAction = disableRipple) => {
    return useEventCallback((event) => {
      if(!skipRippleAction && rippleRef.current) {
        rippleRef.current[rippleAction](event)
      }

      return true
    })
  }

  const handleBlur = useRippleHandler('stop', false)
  const handleMouseDown = useRippleHandler('start')
  const handleContextMenu = useRippleHandler('stop')
  const handleDragLeave = useRippleHandler('stop')
  const handleMouseUp = useRippleHandler('stop')
  const handleMouseLeave = useRippleHandler('stop')
  const handleTouchStart = useRippleHandler('start')
  const handleTouchEnd = useRippleHandler('stop')
  const handleTouchMove = useRippleHandler('stop')

  const getRippleHandlers = useMemo(() => {
    const rippleHandlers = {
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onContextMenu: handleContextMenu,
      onDragLeave: handleDragLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    }

    return (otherEvents) => {
      const eventNames = Object.keys(rippleHandlers)
      const wrappedEvents = eventNames.map((eventName) => ({
        name: eventName,
        handler: (e) => {
          if(otherEvents[eventName]) {
            otherEvents[eventName](e)
          }
          rippleHandlers[eventName](e)
        },
      }))

      return wrappedEvents.reduce((acc, current) => {
        acc[current.name] = current.handler
        return acc
      }, {})
    }
  }, [
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    handleDragLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
  ])

  return {
    getRippleHandlers,
  }
}
