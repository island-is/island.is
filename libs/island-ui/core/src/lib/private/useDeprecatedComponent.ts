import { useEffect } from 'react'

const useDeprecatedComponent = (
  componentName: string,
  customMsg: string = `${componentName} is deprecated`,
) =>
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(customMsg)
    }
  }, [componentName])

export default useDeprecatedComponent
