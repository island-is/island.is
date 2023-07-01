import React from 'react'

export type Rect = { width: number; height: number }

const getCurrentViewport = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
    height:
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight,
  }
}

export const ViewportContext = React.createContext<Rect>(getCurrentViewport())

export const ViewportProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [state, setState] = React.useState<Rect>(getCurrentViewport())

  const handleWindowResize = () => {
    const rect = getCurrentViewport()
    setState(rect)
  }

  React.useEffect(() => {
    handleWindowResize()
  }, [])

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <ViewportContext.Provider value={state}>
      {children}
    </ViewportContext.Provider>
  )
}
