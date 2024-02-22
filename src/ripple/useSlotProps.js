export const extractEventHandlers = (object, excludeKeys = []) => {
  if(object === undefined) return {}

  const result = {}

  Object.keys(object)
    .filter((prop) => prop.match(/^on[A-Z]/) && typeof object[prop] === 'function' && !excludeKeys.includes(prop))
    .forEach((prop) => { result[prop] = object[prop] })

  return result
}

export const omitEventHandlers = (object) => {
  if(object === undefined) return {}

  const result = {}

  Object.keys(object)
    .filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === 'function'))
    .forEach((prop) => { result[prop] = object[prop] })

  return result
}

export const useSlotProps = (parameters) => {
  const { getSlotProps, additionalProps, externalForwardedProps, className } = parameters

  const eventHandlers = extractEventHandlers(externalForwardedProps)
  const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps)

  const internalSlotProps = getSlotProps(eventHandlers)

  const props = {
    ...internalSlotProps,
    ...additionalProps,
    ...otherPropsWithoutEventHandlers,
  }

  props.className = className

  return props
}
