import { forwardRef, useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { jsx } from 'react/jsx-runtime'
import { styled, setup } from 'goober'
import clsx from 'clsx'
import { TouchRipple } from './TouchRipple.jsx'
import { useForkRef } from './useForkRef.js'
import { useIsFocusVisible } from './useIsFocusVisible.js'
import { useEventCallback } from './useEventCallback.js'

setup(jsx)

const RippleRoot = styled('button', forwardRef)`
  position: relative;
  overflow: hidden;
`

const Ripple = forwardRef((props, ref) => {
  const {
    children,
    as = 'button',
    type,
    tabIndex = 0,
    href,
    to,
    disabled = false,
    disableRipple = false,
    focusRipple = false,
    centerRipple = false,
    disabledClassName,
    focusVisibleClassName,
    onClick,
    onMouseDown,
    onContextMenu,
    onDragLeave,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onFocusVisible,
    ...other
  } = props

  const buttonRef = useRef(null)
  const rippleRef = useRef(null)

  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible()

  const [focusVisible, setFocusVisible] = useState(false)
  if(disabled && focusVisible) {
    setFocusVisible(false)
  }

  const [mountedState, setMountedState] = useState(false)
  useEffect(() => {
    setMountedState(true)
  }, [])

  const enableTouchRipple = mountedState && !disableRipple && !disabled

  useEffect(() => {
    if(focusVisible && focusRipple && !disableRipple && mountedState) {
      rippleRef.current.pulsate()
    }
  }, [disableRipple, focusRipple, focusVisible, mountedState])

  const useRippleHandler = useCallback((rippleAction, eventCallback) => {
    return useEventCallback((event) => {
      if(eventCallback) {
        eventCallback(event)
      }

      if(rippleRef.current) {
        rippleRef.current[rippleAction](event)
      }

      return true
    })
  }, [])

  const handleMouseDown = useRippleHandler('start', onMouseDown)
  const handleContextMenu = useRippleHandler('stop', onContextMenu)
  const handleDragLeave = useRippleHandler('stop', onDragLeave)
  const handleMouseUp = useRippleHandler('stop', onMouseUp)
  const handleMouseLeave = useRippleHandler('stop', (event) => {
    if(focusVisible) {
      event.preventDefault()
    }
    onMouseLeave?.(event)
  })
  const handleTouchStart = useRippleHandler('start', onTouchStart)
  const handleTouchEnd = useRippleHandler('stop', onTouchEnd)
  const handleTouchMove = useRippleHandler('stop', onTouchMove)
  const handleBlur = useRippleHandler('stop', (event) => {
    handleBlurVisible(event)
    if(isFocusVisibleRef.current === false) {
      setFocusVisible(false)
    }
    onBlur?.(event)
  }, false)
  const handleFocus = useEventCallback((event) => {
    if(!buttonRef.current) {
      buttonRef.current = event.currentTarget
    }

    handleFocusVisible(event)
    if(isFocusVisibleRef.current === true) {
      setFocusVisible(true)

      onFocusVisible?.(event)
    }

    onFocus?.(event)
  })

  const keydownRef = useRef(null)
  const handleKeyDown = useEventCallback((event) => {
    if(
      focusRipple &&
      !keydownRef.current &&
      focusVisible &&
      rippleRef.current &&
      event.key === ' '
    ) {
      keydownRef.current = true
      rippleRef.current.stop(event, () => {
        rippleRef.current.start(event)
      })
    }

    if(event.target === event.currentTarget && as === 'button' && event.key === ' ') {
      event.preventDefault()
    }

    onKeyDown?.(event)

    if(
      event.target === event.currentTarget &&
      as === 'button' &&
      event.key === 'Enter' &&
      !disabled
    ) {
      event.preventDefault()
      onClick?.(event)
    }
  })
  const handleKeyUp = useEventCallback((event) => {
    if(
      focusRipple &&
      event.key === ' ' &&
      rippleRef.current &&
      focusVisible &&
      !event.defaultPrevented
    ) {
      keydownRef.current = false
      rippleRef.current.stop(event, () => {
        rippleRef.current.pulsate(event)
      })
    }

    onKeyUp?.(event)

    if(
      onClick &&
      event.target === event.currentTarget &&
      as === 'button' &&
      event.key === ' ' &&
      !event.defaultPrevented
    ) {
      onClick(event)
    }
  })

  const buttonProps = useMemo(() => {
    const buttonProps = {}
    if(as === 'button') {
      buttonProps.type = type === undefined ? 'button' : type
      buttonProps.disabled = disabled
    } else {
      if(!href && !to) {
        buttonProps.role = 'button'
      }
      if(disabled) {
        buttonProps['aria-disabled'] = disabled
      }
    }
    return buttonProps
  }, [as, type, disabled, href, to])

  const handleRef = useForkRef(ref, focusVisibleRef, buttonRef)

  return <RippleRoot
    ref={handleRef}
    as={as}
    type={type}
    tabIndex={disabled ? -1 : tabIndex}
    href={href}
    to={to}
    className={clsx(props.className, disabled && disabledClassName, focusVisible && focusVisibleClassName)}
    onClick={onClick}
    onMouseDown={handleMouseDown}
    onContextMenu={handleContextMenu}
    onDragLeave={handleDragLeave}
    onKeyUp={handleKeyUp}
    onMouseLeave={handleMouseLeave}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    onTouchMove={handleTouchMove}
    onBlur={handleBlur}
    onFocus={handleFocus}
    onKeyDown={handleKeyDown}
    onMouseUp={handleMouseUp}
    {...buttonProps}
    {...other}
  >
    {children}
    {enableTouchRipple ? <TouchRipple center={centerRipple} ref={rippleRef} /> : null}
  </RippleRoot>
})

export {
  Ripple,
}
