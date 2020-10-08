import { useEffect } from 'react'

export const useDeprecatedComponent = (componentName: string) =>
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`${componentName} is deprecated`)
    }
  }, [componentName])
