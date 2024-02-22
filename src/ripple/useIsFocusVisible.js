// based on https://github.com/WICG/focus-visible/blob/v4.1.5/src/focus-visible.js

import { useRef, useCallback } from 'react'

let hadKeyboardEvent = true
let hadFocusVisibleRecently = false
let hadFocusVisibleRecentlyTimeout = null

const inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  'datetime-local': true,
}

const focusTriggersKeyboardModality = (node) => {
  const { type, tagName } = node

  if(tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) return true

  if(tagName === 'TEXTAREA' && !node.readOnly) return true

  if(node.isContentEditable) return true

  return false
}

const handleKeyDown = (event) => {
  if(event.metaKey || event.altKey || event.ctrlKey) return

  hadKeyboardEvent = true
}

const handlePointerDown = () => {
  hadKeyboardEvent = false
}

const handleVisibilityChange = (doc) => {
  if(doc.visibilityState === 'hidden') {
    if(hadFocusVisibleRecently) {
      hadKeyboardEvent = true
    }
  }
}

const prepare = (doc) => {
  doc.addEventListener('keydown', handleKeyDown, true)
  doc.addEventListener('mousedown', handlePointerDown, true)
  doc.addEventListener('pointerdown', handlePointerDown, true)
  doc.addEventListener('touchstart', handlePointerDown, true)
  doc.addEventListener('visibilitychange', handleVisibilityChange, true)
}

const isFocusVisible = (event) => {
  const { target } = event
  try {
    return target.matches(':focus-visible')
  } catch (error) {
    console.error(error)
  }

  return hadKeyboardEvent || focusTriggersKeyboardModality(target)
}

export const useIsFocusVisible = () => {
  const ref = useCallback((node) => {
    if(node != null) {
      prepare(node.ownerDocument)
    }
  }, [])

  const isFocusVisibleRef = useRef(false)

  const handleBlurVisible = () => {
    if(isFocusVisibleRef.current) {
      hadFocusVisibleRecently = true
      window.clearTimeout(hadFocusVisibleRecentlyTimeout)
      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false
      }, 100)

      isFocusVisibleRef.current = false

      return true
    }

    return false
  }

  const handleFocusVisible = (event) => {
    if(isFocusVisible(event)) {
      isFocusVisibleRef.current = true
      return true
    }
    return false
  }

  return { isFocusVisibleRef, onFocus: handleFocusVisible, onBlur: handleBlurVisible, ref }
}
