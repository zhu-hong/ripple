import { forwardRef, useImperativeHandle } from 'react'
import clsx from 'clsx'
import { useTransition } from 'react-transition-state'

export const RippleAnimate = forwardRef(({ className, classes, rippleX, rippleY, rippleSize, timeout, pulsate= false, flag, onUnmounted }, ref) => {
  const [{ status }, toggle] = useTransition({
    timeout,
    initialEntered: true,
    unmountOnExit: true,
    onStateChange: ({ current }) => {
      if(current.status === 'unmounted') {
        onUnmounted(flag)
      }
    },
  })

  useImperativeHandle(ref, () => ({
    toggle,
  }), [toggle])

  return <span
    className={clsx(className, classes.ripple, classes.rippleVisible, {
      [classes.ripplePulsate]: pulsate,
    })}
    style={{
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX,
    }}
  >
    <span
      className={clsx(classes.child, {
        [classes.childLeaving]: status === 'exiting',
        [classes.childPulsate]: pulsate,
      })}
    />
  </span>
})
