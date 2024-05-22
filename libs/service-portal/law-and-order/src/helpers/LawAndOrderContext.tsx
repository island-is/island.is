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
  subpoenaAcknowledged: boolean | undefined
  subpoenaModalVisible: boolean
  defenseChoice: DefenseDecision | undefined
  lawyerSelected: string | undefined

  setSubpoenaAcknowledged: Dispatch<SetStateAction<boolean | undefined>>
  setSubpoenaModalVisible: Dispatch<SetStateAction<boolean>>
  setDefenseChoice: Dispatch<SetStateAction<DefenseDecision | undefined>>
  setLawyerSelected: Dispatch<SetStateAction<string | undefined>>
}

export const LawAndOrderContext = createContext<LawAndOrderStateProps>({
  subpoenaAcknowledged: undefined,
  subpoenaModalVisible: false,
  defenseChoice: undefined,
  lawyerSelected: undefined,

  setSubpoenaAcknowledged: () => undefined,
  setSubpoenaModalVisible: () => undefined,
  setDefenseChoice: () => undefined,
  setLawyerSelected: () => undefined,
})

export const LawAndOrderProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [subpoenaAcknowledged, setSubpoenaAcknowledged] = useState<
    boolean | undefined
  >(undefined)

  const [subpoenaModalVisible, setSubpoenaModalVisible] =
    useState<boolean>(false)

  const [defenseChoice, setDefenseChoice] = useState<
    DefenseDecision | undefined
  >(undefined)

  const [lawyerSelected, setLawyerSelected] = useState<string | undefined>(
    undefined,
  )

  return (
    <LawAndOrderContext.Provider
      value={{
        subpoenaAcknowledged,
        subpoenaModalVisible,
        defenseChoice,
        lawyerSelected,
        setSubpoenaAcknowledged,
        setSubpoenaModalVisible,
        setDefenseChoice,
        setLawyerSelected,
      }}
    >
      {children}
    </LawAndOrderContext.Provider>
  )
}

export const useLawAndOrderContext = () => useContext(LawAndOrderContext)
