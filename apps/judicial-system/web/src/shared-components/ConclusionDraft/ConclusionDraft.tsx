import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { CaseType, isRestrictionCase } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  Decision,
  RulingInput,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  icRulingStepOne,
  rcRulingStepOne,
} from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const ConclusionDraft: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={2}>
        <Text>
          Hér er hægt að skrifa drög að niðurstöðu í málinu. Endanlegur
          frágangur niðurstöðu og úrskurðar fer fram í þinghaldi. Athugið að
          drögin vistast sjálfkrafa.
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Úrskurður</Text>
      </Box>
      <Box marginBottom={3}>
        <Decision
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          acceptedLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(rcRulingStepOne.sections.decision.acceptLabel, {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                })
              : formatMessage(icRulingStepOne.sections.decision.acceptLabel)
          }
          rejectedLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(rcRulingStepOne.sections.decision.rejectLabel, {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                })
              : formatMessage(icRulingStepOne.sections.decision.rejectLabel)
          }
          partiallyAcceptedLabelText={`${
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  rcRulingStepOne.sections.decision.partiallyAcceptLabel,
                )
              : formatMessage(
                  icRulingStepOne.sections.decision.partiallyAcceptLabel,
                )
          }`}
          dismissLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(rcRulingStepOne.sections.decision.dismissLabel, {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                })
              : formatMessage(icRulingStepOne.sections.decision.dismissLabel)
          }
          acceptingAlternativeTravelBanLabelText={formatMessage(
            rcRulingStepOne.sections.decision
              .acceptingAlternativeTravelBanLabel,
          )}
        />
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Drög að niðurstöðu</Text>
      </Box>
      <RulingInput
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isRequired={false}
        rows={12}
      />
    </>
  )
}

export default ConclusionDraft
