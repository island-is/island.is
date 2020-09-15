import { useEffect } from 'react'

const useDeprecatedComponent = (componentName: string) =>
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`${componentName} is deprecated`)
    }
  }, [componentName])

export default useDeprecatedComponent
