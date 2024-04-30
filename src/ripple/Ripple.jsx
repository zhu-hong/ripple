import { forwardRef, useRef, useEffect, useMemo } from 'react'
import { jsx } from 'react/jsx-runtime'
import { styled, setup } from 'goober'
import clsx from 'clsx'
import { TouchRipple } from './TouchRipple.jsx'
import { useTouchRipple } from './useTouchRipple'
import { useButton } from './useButton'
import { useForkRef } from './useForkRef'
import { useSlotProps } from './useSlotProps'

setup(jsx)

const RippleRoot = styled('button', forwardRef)`
  position: relative;
  overflow: hidden;
`

const Ripple = forwardRef((props, ref) => {
  const {
    children,
    as = 'button',
    tabIndex = 0,
    disableRipple = false,
    focusRipple = false,
    centerRipple = false,
    disabledClassName,
    focusVisibleClassName,
    ...other
  } = props

  const buttonRef = useRef(null)
  const handleRef = useForkRef(buttonRef, ref)
  const { focusVisible, getRootProps } = useButton({
    disabled: props.disabled,
    rootRef: handleRef,
    tabIndex: tabIndex,
  })

  const rippleRef = useRef(null)
  const handleRippleRef = useForkRef(rippleRef)
  const getRippleHandlers = useTouchRipple({
    disableRipple,
    rippleRef,
  })
  
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
      tabIndex,
      as,
    },
  })

  const enableTouchRipple = useMemo(() => {
    return !props.disabled && !props.disableRipple
  }, [props])

  return (
    <RippleRoot {...rootProps}>
      {children}
      {enableTouchRipple ? <TouchRipple center={centerRipple} ref={handleRippleRef} /> : null}
    </RippleRoot>
  )
})

export {
  Ripple,
}
