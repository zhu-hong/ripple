import { useRef, useState, useEffect, useCallback } from 'react'
import { useForkRef } from './useForkRef'
import { extractEventHandlers } from './useSlotProps'
import { useIsFocusVisible } from './useIsFocusVisible'

export const useButton =(params) => {
  const { disabled = false, focusableWhenDisabled, rootRef: externalRef, tabIndex, type } = params

  const buttonRef = useRef(null)

  const [active, setActive] = useState(false)

  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible()

  const [focusVisible, setFocusVisible] = useState(false)
  if(disabled && !focusableWhenDisabled && focusVisible) {
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

    if(otherHandlers.onMouseLeave) {
      otherHandlers.onMouseLeave(event)
    }
  }

  const createHandleBlur = (otherHandlers) => (event) => {
    handleBlurVisible(event)

    if(isFocusVisibleRef.current === false) {
      setFocusVisible(false)
    }

    if(otherHandlers.onBlur) {
      otherHandlers.onBlur(event)
    }
  }

  const createHandleFocus =
    (otherHandlers) => (event) => {
      if(!buttonRef.current) {
        buttonRef.current = event.currentTarget
      }

      handleFocusVisible(event)
      if(isFocusVisibleRef.current === true) {
        setFocusVisible(true)
      }

      if(otherHandlers.onFocus) {
        otherHandlers.onFocus(event)
      }
    }

  const isNativeButton = () => {
    const button = buttonRef.current

    return (
      hostElementName === 'BUTTON'
      ||
      (hostElementName === 'INPUT' && button && ['button', 'submit', 'reset'].includes((button.type)))
      ||
      (hostElementName === 'A' && button && button.href)
    )
  }

  const createHandleClick = (otherHandlers) => (event) => {
    if(!disabled) {
      if(otherHandlers.onClick) {
        otherHandlers.onClick(event)
      }
    }
  }

  const createHandleMouseDown = (otherHandlers) => (event) => {
    if(!disabled) {
      setActive(true)
      document.addEventListener(
        'mouseup',
        () => {
          setActive(false)
        },
        { once: true },
      )
    }

    if(otherHandlers.onMouseDown) {
      otherHandlers.onMouseDown(event)
    }
  }

  const createHandleKeyDown = (otherHandlers) => (event) => {
    if(otherHandlers.onKeyDown) {
      otherHandlers.onKeyDown(event)
    }

    if(event.target === event.currentTarget && !isNativeButton() && event.key === ' ') {
      event.preventDefault()
    }

    if(event.target === event.currentTarget && event.key === ' ' && !disabled) {
      setActive(true)
    }

    if(
      event.target === event.currentTarget
      && !isNativeButton()
      && event.key === 'Enter'
      && !disabled
    ) {
      if(otherHandlers.onClick) {
        otherHandlers.onClick(event)
      }
      event.preventDefault()
    }
  }

  const createHandleKeyUp = (otherHandlers) => (event) => {
    if(event.target === event.currentTarget) {
      setActive(false)
    }

    if(otherHandlers.onKeyUp) {
      otherHandlers.onKeyUp(event)
    }

    if(
      event.target === event.currentTarget
      && !isNativeButton()
      && !disabled
    ) {
      if(otherHandlers.onClick) {
        otherHandlers.onClick(event)
      }
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
    buttonProps.type = type || 'button'
    if(focusableWhenDisabled) {
      buttonProps['aria-disabled'] = disabled
    } else {
      buttonProps.disabled = disabled
    }
  } else if(hostElementName !== '') {
    if(disabled) {
      buttonProps['aria-disabled'] = disabled
      buttonProps.tabIndex = focusableWhenDisabled ? (tabIndex || 0) : -1
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
