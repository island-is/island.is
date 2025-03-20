import { FC, useContext } from 'react'

import { RadioButton } from '@island.is/island-ui/core'

import { Defendant, VerdictAppealDecision } from '../../graphql/schema'
import { useDefendants } from '../../utils/hooks'
import { FormContext } from '../FormProvider/FormProvider'
import * as styles from './VerdictAppealDecisionChoice.css'

interface Props {
  defendant: Defendant
  disabled?: boolean
}

const VerdictAppealDecisionChoice: FC<Props> = (props) => {
  const { defendant, disabled } = props
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  return (
    <div className={styles.gridRow}>
      <RadioButton
        id={`defendant-${defendant.id}-verdict-appeal-decision-postpone`}
        name={`defendant-${defendant.id}-verdict-appeal-decision`}
        checked={
          defendant.verdictAppealDecision === VerdictAppealDecision.POSTPONE
        }
        onChange={() => {
          setAndSendDefendantToServer(
            {
              defendantId: defendant.id,
              caseId: workingCase.id,
              verdictAppealDecision: VerdictAppealDecision.POSTPONE,
            },
            setWorkingCase,
          )
        }}
        large
        backgroundColor="white"
        label="Dómfelldi tekur áfrýjunarfrest"
        disabled={disabled}
      />
      <RadioButton
        id={`defendant-${defendant.id}-verdict-appeal-decision-accept`}
        name={`defendant-${defendant.id}-verdict-appeal-decision`}
        checked={
          defendant.verdictAppealDecision === VerdictAppealDecision.ACCEPT
        }
        onChange={() => {
          setAndSendDefendantToServer(
            {
              defendantId: defendant.id,
              caseId: workingCase.id,
              verdictAppealDecision: VerdictAppealDecision.ACCEPT,
            },
            setWorkingCase,
          )
        }}
        large
        backgroundColor="white"
        label="Dómfelldi unir"
        disabled={disabled}
      />
    </div>
  )
}

export default VerdictAppealDecisionChoice
