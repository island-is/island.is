import type { FC } from 'react'
import { useContext } from 'react'

import { RadioButton } from '@island.is/island-ui/core'
import { getDefendantVerdictAppealDecisionLabel } from '@island.is/judicial-system/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import type {
  Defendant,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { VerdictAppealDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

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
    <RadioGroup
      legend="Afstaða dómfellda til dóms"
      hideLegend
      className={styles.gridRow}
    >
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
        label={getDefendantVerdictAppealDecisionLabel(
          VerdictAppealDecision.POSTPONE,
        )}
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
        label={getDefendantVerdictAppealDecisionLabel(
          VerdictAppealDecision.ACCEPT,
        )}
        disabled={disabled}
      />
    </RadioGroup>
  )
}

export default VerdictAppealDecisionChoice
