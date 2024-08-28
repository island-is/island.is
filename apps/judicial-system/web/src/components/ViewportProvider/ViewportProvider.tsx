import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'

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

export const ViewportContext = createContext<Rect>(getCurrentViewport())

export const ViewportProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<Rect>(getCurrentViewport())

  const handleWindowResize = () => {
    const rect = getCurrentViewport()
    setState(rect)
  }

  useEffect(() => {
    handleWindowResize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <ViewportContext.Provider value={state}>
      {children}
    </ViewportContext.Provider>
  )
}
