import { useEffect } from 'react'

export const useDeprecatedComponent = (
  componentName: string,
  newComponentName?: string,
) => {
  const newComponent = newComponentName
    ? ` Please now use ${newComponentName}.`
    : ''
  const message = `${componentName} has been deprecated.${newComponent}`

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message)
    }
  }, [message])
}
