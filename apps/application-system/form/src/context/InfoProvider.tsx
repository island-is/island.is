import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface InfoProvider {
  institutionName: string | undefined
  applicationName: string | undefined
  setApplicationName: Dispatch<SetStateAction<string | undefined>>
  setInstitutionName: Dispatch<SetStateAction<string | undefined>>
}

export const InfoContext = createContext<InfoProvider>({
  institutionName: undefined,
  applicationName: undefined,
  setApplicationName: () => undefined,
  setInstitutionName: () => undefined,
})

export const InfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [applicationName, setApplicationName] = useState<string | undefined>(
    undefined,
  )
  const [institutionName, setInstitutionName] = useState<string | undefined>(
    undefined,
  )

  return (
    <InfoContext.Provider
      value={{
        institutionName,
        applicationName,
        setApplicationName,
        setInstitutionName,
      }}
    >
      {children}
    </InfoContext.Provider>
  )
}

export const useInfoState = () => useContext(InfoContext)
