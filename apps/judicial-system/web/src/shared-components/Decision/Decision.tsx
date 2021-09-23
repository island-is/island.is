import { Box, RadioButton } from '@island.is/island-ui/core'
import { CaseDecision, CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import React from 'react'
import { BlueBox } from '..'
import { setAndSendToServer } from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  acceptedLabelText: string
  rejectedLabelText: string
  partiallyAcceptedLabelText: string
  dismissLabelText: string
}

const Decision: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    acceptedLabelText,
    rejectedLabelText,
    partiallyAcceptedLabelText,
    dismissLabelText,
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
      {workingCase.type !== CaseType.TRAVEL_BAN && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-partially"
            label={partiallyAcceptedLabelText}
            checked={
              workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
              workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY
            }
            onChange={() => {
              setAndSendToServer(
                'decision',
                workingCase.type === CaseType.CUSTODY
                  ? CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                  : CaseDecision.ACCEPTING_PARTIALLY,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }}
            large
            backgroundColor="white"
          />
        </Box>
      )}
      <Box marginTop={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-dismissing"
          label={dismissLabelText}
          checked={workingCase.decision === CaseDecision.DISMISSING}
          onChange={() => {
            setAndSendToServer(
              'decision',
              CaseDecision.DISMISSING,
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }}
          large
          backgroundColor="white"
        />
      </Box>
    </BlueBox>
  )
}

export default Decision
