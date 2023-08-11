import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface Info {
  applicationName?: string
  institutionName?: string
}

interface HeaderInfoProvider {
  info: Info
  setInfo: Dispatch<SetStateAction<Info>>
}

export const HeaderInfoContext = createContext<HeaderInfoProvider>({
  info: {
    applicationName: undefined,
    institutionName: undefined,
  },
  setInfo: () => undefined,
})

export const HeaderInfoProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [info, setInfo] = useState<Info>({
    applicationName: undefined,
    institutionName: undefined,
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

export const useHeaderInfo = () => useContext(HeaderInfoContext)
