import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { DefenseDecision } from '../lib/const'

export type LawAndOrderStateProps = {
  subpeonaAcknowledged: boolean | undefined
  subpeonaModalVisible: boolean
  defenseChoice: DefenseDecision | undefined

  setSubpeonaAcknowledged: Dispatch<SetStateAction<boolean | undefined>>
  setSubpeonaModalVisible: Dispatch<SetStateAction<boolean>>
  setDefenseChoice: Dispatch<SetStateAction<DefenseDecision | undefined>>
}

export const LawAndOrderContext = createContext<LawAndOrderStateProps>({
  subpeonaAcknowledged: undefined,
  subpeonaModalVisible: false,
  defenseChoice: undefined,

  setSubpeonaAcknowledged: () => undefined,
  setSubpeonaModalVisible: () => undefined,
  setDefenseChoice: () => undefined,
})

export const LawAndOrderProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [subpeonaAcknowledged, setSubpeonaAcknowledged] = useState<
    boolean | undefined
  >(undefined)

  const [subpeonaModalVisible, setSubpeonaModalVisible] =
    useState<boolean>(false)

  const [defenseChoice, setDefenseChoice] = useState<
    DefenseDecision | undefined
  >(undefined)

  return (
    <LawAndOrderContext.Provider
      value={{
        subpeonaAcknowledged,
        subpeonaModalVisible,
        defenseChoice,
        setSubpeonaAcknowledged,
        setSubpeonaModalVisible,
        setDefenseChoice,
      }}
    >
      {children}
    </LawAndOrderContext.Provider>
  )
}

export const useLawAndOrderContext = () => useContext(LawAndOrderContext)
