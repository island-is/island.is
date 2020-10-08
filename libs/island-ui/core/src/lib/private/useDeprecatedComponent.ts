import { useEffect } from 'react'

const useDeprecatedComponent = (
  componentName: string,
  customMsg = `${componentName} is deprecated`,
) =>
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(customMsg)
    }
  }, [componentName])

export default useDeprecatedComponent
