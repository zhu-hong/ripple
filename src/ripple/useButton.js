import { useRef, useState, useEffect, useCallback } from 'react'
import { useForkRef } from './useForkRef'
import { extractEventHandlers } from './useSlotProps'
import { useIsFocusVisible } from './useIsFocusVisible'

export const useButton =(params) => {
  const { disabled = false, rootRef: externalRef, tabIndex, type } = params

  const buttonRef = useRef(null)

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

  useEffect(() => {
    isFocusVisibleRef.current = focusVisible
  }, [focusVisible, isFocusVisibleRef])

  const [hostElementName, setHostElementName] = useState('')

  const createHandleMouseLeave = (otherHandlers) => (event) => {
    if(focusVisible) {
      event.preventDefault()
    }

    otherHandlers.onMouseLeave?.(event)
  }

  const createHandleBlur = (otherHandlers) => (event) => {
    handleBlurVisible(event)

    if(isFocusVisibleRef.current === false) {
      setFocusVisible(false)
    }

    otherHandlers.onBlur?.(event)
  }

  const createHandleFocus =
    (otherHandlers) => (event) => {
      if(!buttonRef.current) {
        buttonRef.current = event.currentTarget
      }

      handleFocusVisible(event)
      if(isFocusVisibleRef.current === true) {
        setFocusVisible(true)
        otherHandlers.onFocusVisible?.(event)
      }

      otherHandlers.onFocus?.(event)
    }

  const isNativeButton = () => {
    const button = buttonRef.current

    return (
      hostElementName === 'BUTTON'
      ||
      (hostElementName === 'INPUT' && ['button', 'submit', 'reset'].includes((button?.type)))
      ||
      (hostElementName === 'A' && button?.href)
    )
  }

  const createHandleClick = (otherHandlers) => (event) => {
    if(!disabled) {
      otherHandlers.onClick?.(event)
    }
  }

  const createHandleMouseDown = (otherHandlers) => (event) => {
    otherHandlers.onMouseDown?.(event)
  }

  const createHandleKeyDown = (otherHandlers) => (event) => {
    otherHandlers.onKeyDown?.(event)

    if(event.target === event.currentTarget && !isNativeButton() && event.key === ' ') {
      event.preventDefault()
    }

    if(
      event.target === event.currentTarget
      && !isNativeButton()
      && event.key === 'Enter'
      && !disabled
    ) {
      otherHandlers.onClick?.(event)
      event.preventDefault()
    }
  }

  const createHandleKeyUp = (otherHandlers) => (event) => {
    otherHandlers.onKeyUp?.(event)

    if(
      event.target === event.currentTarget
      && !isNativeButton()
      && !disabled
      && event.key === ' ' 
    ) {
      otherHandlers.onClick?.(event)
    }
  }

  const updateHostElementName = useCallback((instance) => {
    setHostElementName(instance ? instance.tagName : '')
  }, [])

  const handleRef = useForkRef(updateHostElementName, externalRef, focusVisibleRef, buttonRef)

  const buttonProps = {}

  if(tabIndex !== undefined) {
    buttonProps.tabIndex = tabIndex
  }

  if(hostElementName === 'BUTTON') {
    buttonProps.type = type ?? 'button'
    buttonProps.disabled = disabled
  } else if (hostElementName === 'INPUT') {
    if (type && ['button', 'submit', 'reset'].includes(type)) {
      buttonProps.disabled = disabled
    }
  } else if(hostElementName !== '') {
    buttonProps.role = 'button'
    buttonProps.tabIndex = tabIndex ?? 0
    if(disabled) {
      buttonProps['aria-disabled'] = disabled
      buttonProps.tabIndex = -1
    }
  }

  const getRootProps = (externalProps) => {
    const externalEventHandlers = {
      ...extractEventHandlers(params),
      ...extractEventHandlers(externalProps),
    }

    const props = {
      type,
      ...externalEventHandlers,
      ...buttonProps,
      ...externalProps,
      onBlur: createHandleBlur(externalEventHandlers),
      onClick: createHandleClick(externalEventHandlers),
      onFocus: createHandleFocus(externalEventHandlers),
      onKeyDown: createHandleKeyDown(externalEventHandlers),
      onKeyUp: createHandleKeyUp(externalEventHandlers),
      onMouseDown: createHandleMouseDown(externalEventHandlers),
      onMouseLeave: createHandleMouseLeave(externalEventHandlers),
      ref: handleRef,
    }

    return props
  }

  return {
    getRootProps,
    focusVisible,
  }
}
