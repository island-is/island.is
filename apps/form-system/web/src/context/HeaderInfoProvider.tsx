import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
} from 'react'

interface FormInfo {
  applicationName?: string
  organizationName?: string
  isTest?: boolean
}

interface HeaderInfoProvider {
  info: FormInfo
  setInfo: Dispatch<SetStateAction<FormInfo>>
}

export const HeaderInfoContext = createContext<HeaderInfoProvider>({
  info: {
    applicationName: undefined,
    organizationName: undefined,
    isTest: undefined,
  },
  setInfo: () => undefined,
})

export const HeaderInfoProvider = ({ children }: { children: ReactNode }) => {
  const [info, setInfo] = useState<FormInfo>({
    applicationName: undefined,
    organizationName: undefined,
    isTest: undefined,
  })

  return (
    <HeaderInfoContext.Provider
      value={{
        info,
        setInfo,
      }}
    >
      {children}
    </HeaderInfoContext.Provider>
  )
}

export const useHeaderInfo = (): HeaderInfoProvider => {
  const context = useContext(HeaderInfoContext)

  if (!context) {
    throw new Error('useHeaderInfo must be used within a HeaderInfoProvider')
  }

  return context
}
