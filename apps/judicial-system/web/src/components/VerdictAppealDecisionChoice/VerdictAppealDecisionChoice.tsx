import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { RadioButton } from '@island.is/island-ui/core'

import { Defendant, VerdictAppealDecision } from '../../graphql/schema'
import { useDefendants } from '../../utils/hooks'
import { FormContext } from '../FormProvider/FormProvider'
import { strings } from './VerdictAppealDecisionChoice.strings'
import * as styles from './VerdictAppealDecisionChoice.css'

interface Props {
  defendant: Defendant
}

const VerdictAppealDecisionChoice: FC<Props> = (props) => {
  const { defendant } = props
  const { formatMessage } = useIntl()
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
        label={formatMessage(strings.verdictAppealDecisionPostpone)}
      />
      <RadioButton
        id={`defendant-${defendant.id}-verdict-appeal-decision-appeal`}
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
        label={formatMessage(strings.verdictAppealDecisionAccept)}
      />
    </div>
  )
}

export default VerdictAppealDecisionChoice
