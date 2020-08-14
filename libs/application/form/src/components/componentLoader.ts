import * as components from './fields'

export function getComponentByName(componentName) {
  return components[componentName] || null
}
