import { forwardRef, useImperativeHandle } from 'react'
import clsx from 'clsx'
import { useTransition } from 'react-transition-state'

export const RippleAnimate = forwardRef(({ className, classes, rippleX, rippleY, rippleSize, timeout, pulsate= false, flag, onUnmounted }, ref) => {
  const [{ status, isMounted }, toggle] = useTransition({
    timeout,
    initialEntered: true,
    unmountOnExit: true,
    onStateChange: ({ current }) => {
      if(current.status === 'unmounted') {
        onUnmounted(flag)
      }
    },
  })

  const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible, {
    [classes.ripplePulsate]: pulsate,
  })

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  }

  const childClassName = clsx(classes.child, {
    [classes.childLeaving]: status === 'exiting',
    [classes.childPulsate]: pulsate,
  })

  useImperativeHandle(ref, () => ({
    toggle,
  }), [toggle])

  return (isMounted ? <span className={rippleClassName} style={rippleStyles}>
    <span className={childClassName} />
  </span> : null)
})
