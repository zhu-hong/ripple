import { createElement, forwardRef, useRef, useEffect } from 'react'
import { styled, setup } from 'goober'
import { TouchRipple } from './TouchRipple.jsx'
import { useTouchRipple } from './useTouchRipple'
import { useButton } from './useButton'
import { useForkRef } from './useForkRef'
import { useSlotProps } from './useSlotProps'
import clsx from 'clsx'

setup(createElement)

const RippleRoot = styled('button', forwardRef)`
  position: relative;
  overflow: hidden;
`

const Ripple = forwardRef((props, ref) => {
  const {
    children,
    as = 'button',
    disableRipple = false,
    focusRipple = false,
    centerRipple = false,
    disabledClassName,
    focusVisibleClassName,
    tabIndex = 0,
    ...other
  } = props

  const buttonRef = useRef(null)
  const handleRef = useForkRef(buttonRef, ref)
  const { focusVisible, getRootProps } = useButton({
    rootRef: handleRef,
  })

  const rippleRef = useRef(null)
  const handleRippleRef = useForkRef(rippleRef)
  const { getRippleHandlers } = useTouchRipple({
    disableRipple,
    rippleRef,
  })

  const enableTouchRipple = !props.disabled && !disableRipple
  
  useEffect(() => {
    if(focusVisible && focusRipple && !disableRipple && rippleRef.current) {
      rippleRef.current.pulsate()
    }
  }, [focusVisible, focusRipple, disableRipple, rippleRef.current])

  const rootProps = useSlotProps({
    getSlotProps: (otherHandlers) => getRootProps({
      ...otherHandlers,
      ...getRippleHandlers(props),
    }),
    externalForwardedProps: other,
    additionalProps: {
      className: clsx(props.className, props.disabled && disabledClassName, focusVisible && focusVisibleClassName),
    },
  })

  return (
    <RippleRoot as={as} tabIndex={props.disabled ? -1 : tabIndex} {...rootProps}>
      {children}
      {enableTouchRipple ? <TouchRipple center={centerRipple} ref={handleRippleRef} /> : null}
    </RippleRoot>
  )
})

export {
  Ripple,
}
