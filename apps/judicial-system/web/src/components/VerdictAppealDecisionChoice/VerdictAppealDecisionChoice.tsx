import { FC, useContext } from 'react'

import { RadioButton } from '@island.is/island-ui/core'

import { Defendant, Verdict, VerdictAppealDecision } from '../../graphql/schema'
import useVerdict from '../../utils/hooks/useVerdict'
import { FormContext } from '../FormProvider/FormProvider'
import * as styles from './VerdictAppealDecisionChoice.css'

interface Props {
  defendant: Defendant
  verdict: Verdict
  disabled?: boolean
}

const VerdictAppealDecisionChoice: FC<Props> = (props) => {
  const { defendant, verdict, disabled } = props
  const { setAndSendVerdictToServer } = useVerdict()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  return (
    <div className={styles.gridRow}>
      <RadioButton
        id={`defendant-${defendant.id}-verdict-appeal-decision-postpone`}
        name={`defendant-${defendant.id}-verdict-appeal-decision`}
        checked={verdict.appealDecision === VerdictAppealDecision.POSTPONE}
        onChange={() => {
          setAndSendVerdictToServer(
            {
              defendantId: defendant.id,
              caseId: workingCase.id,
              appealDecision: VerdictAppealDecision.POSTPONE,
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
        checked={verdict.appealDecision === VerdictAppealDecision.ACCEPT}
        onChange={() => {
          setAndSendVerdictToServer(
            {
              defendantId: defendant.id,
              caseId: workingCase.id,
              appealDecision: VerdictAppealDecision.ACCEPT,
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
