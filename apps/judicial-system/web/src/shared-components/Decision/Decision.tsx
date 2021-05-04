import { Box, RadioButton } from '@island.is/island-ui/core'
import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import React from 'react'
import { BlueBox } from '..'
import { setAndSendToServer } from '../../utils/formHelper'
import useCase from '../../utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const Decision: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()
  return (
    <BlueBox>
      <Box marginBottom={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-accepting"
          label={`Krafa um ${
            workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
          } samþykkt`}
          checked={workingCase.decision === CaseDecision.ACCEPTING}
          onChange={() => {
            setAndSendToServer(
              'decision',
              CaseDecision.ACCEPTING,
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }}
          large
          filled
        />
      </Box>
      <Box marginBottom={workingCase.type === CaseType.CUSTODY ? 2 : 0}>
        <RadioButton
          name="case-decision"
          id="case-decision-rejecting"
          label={`Kröfu um ${
            workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
          } hafnað`}
          checked={workingCase.decision === CaseDecision.REJECTING}
          onChange={() => {
            setAndSendToServer(
              'decision',
              CaseDecision.REJECTING,
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }}
          large
          filled
        />
      </Box>
      {workingCase.type === CaseType.CUSTODY && (
        <RadioButton
          name="case-decision"
          id="case-decision-accepting-alternative-travel-ban"
          label="Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann"
          checked={
            workingCase.decision ===
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          }
          onChange={() => {
            setAndSendToServer(
              'decision',
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }}
          large
          filled
        />
      )}
    </BlueBox>
  )
}

export default Decision
