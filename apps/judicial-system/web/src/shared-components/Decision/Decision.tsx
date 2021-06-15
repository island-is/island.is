import { Box, RadioButton } from '@island.is/island-ui/core'
import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import React from 'react'
import { BlueBox } from '..'
import { setAndSendToServer } from '../../utils/formHelper'
import useCase from '../../utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  acceptedLabelText: string
  rejectedLabelText: string
  partiallyAcceptedLabelText: string
}

const Decision: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    acceptedLabelText,
    rejectedLabelText,
    partiallyAcceptedLabelText,
  } = props
  const { updateCase } = useCase()

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-accepting"
          label={acceptedLabelText}
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
          backgroundColor="white"
        />
      </Box>
      <Box marginBottom={workingCase.type === CaseType.CUSTODY ? 2 : 0}>
        <RadioButton
          name="case-decision"
          id="case-decision-rejecting"
          label={rejectedLabelText}
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
          backgroundColor="white"
        />
      </Box>
      {workingCase.type === CaseType.CUSTODY && (
        <RadioButton
          name="case-decision"
          id="case-decision-accepting-alternative-travel-ban"
          label={partiallyAcceptedLabelText}
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
          backgroundColor="white"
        />
      )}
    </BlueBox>
  )
}

export default Decision
