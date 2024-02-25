import { useState, useEffect } from 'react'
import clsx from 'clsx'

const RippleAnimate = ({ className, classes, rippleX, rippleY, rippleSize, in: inProp, onExited, timeout, pulsate= false }) => {
  const [leaving, setLeaving] = useState(false)

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
    [classes.childLeaving]: leaving,
    [classes.childPulsate]: pulsate,
  })

  if(!inProp && !leaving) {
    setLeaving(true)
  }
  useEffect(() => {
    if(!inProp && onExited != null) {
      const timeoutId = setTimeout(onExited, timeout)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [inPro, onExited, timeout])

  return <span className={rippleClassName} style={rippleStyles}>
    <span className={childClassName} />
  </span>
}

export default RippleAnimate
