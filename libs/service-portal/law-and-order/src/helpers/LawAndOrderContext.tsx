import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

export type LawAndOrderStateProps = {
  subpoenaAcknowledged: boolean | undefined
  subpoenaModalVisible: boolean

  setSubpoenaAcknowledged: Dispatch<SetStateAction<boolean | undefined>>
  setSubpoenaModalVisible: Dispatch<SetStateAction<boolean>>
}

export const LawAndOrderContext = createContext<LawAndOrderStateProps>({
  subpoenaAcknowledged: undefined,
  subpoenaModalVisible: false,

  setSubpoenaAcknowledged: () => undefined,
  setSubpoenaModalVisible: () => undefined,
})

export const LawAndOrderProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [subpoenaAcknowledged, setSubpoenaAcknowledged] = useState<
    boolean | undefined
  >(undefined)

  const [subpoenaModalVisible, setSubpoenaModalVisible] =
    useState<boolean>(false)

  return (
    <LawAndOrderContext.Provider
      value={{
        subpoenaAcknowledged,
        subpoenaModalVisible,

        setSubpoenaAcknowledged,
        setSubpoenaModalVisible,
      }}
    >
      {children}
    </LawAndOrderContext.Provider>
  )
}

export const useLawAndOrderContext = () => useContext(LawAndOrderContext)
