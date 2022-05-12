import { Box, RadioButton } from '@island.is/island-ui/core'
import { CaseDecision, CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import React from 'react'
import { BlueBox } from '..'
interface Props {
  workingCase: Case
  acceptedLabelText: string
  rejectedLabelText: string
  partiallyAcceptedLabelText: string
  dismissLabelText: string
  acceptingAlternativeTravelBanLabelText?: string
  onChange: (decision: CaseDecision) => void
}

const Decision: React.FC<Props> = (props) => {
  const {
    workingCase,
    acceptedLabelText,
    acceptingAlternativeTravelBanLabelText,
    rejectedLabelText,
    partiallyAcceptedLabelText,
    dismissLabelText,
    onChange,
  } = props

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-accepting"
          label={acceptedLabelText}
          checked={workingCase.decision === CaseDecision.ACCEPTING}
          onChange={() => {
            onChange(CaseDecision.ACCEPTING)
          }}
          large
          backgroundColor="white"
        />
      </Box>
      {workingCase.type !== CaseType.TRAVEL_BAN && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-partially"
            label={partiallyAcceptedLabelText}
            checked={workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY}
            onChange={() => {
              onChange(CaseDecision.ACCEPTING_PARTIALLY)
            }}
            large
            backgroundColor="white"
          />
        </Box>
      )}
      <Box marginTop={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-rejecting"
          label={rejectedLabelText}
          checked={workingCase.decision === CaseDecision.REJECTING}
          onChange={() => {
            onChange(CaseDecision.REJECTING)
          }}
          large
          backgroundColor="white"
        />
      </Box>
      {(workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.ADMISSION_TO_FACILITY) && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-alternative-travel-ban"
            label={acceptingAlternativeTravelBanLabelText}
            checked={
              workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            }
            onChange={() => {
              onChange(CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
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
            onChange(CaseDecision.DISMISSING)
          }}
          large
          backgroundColor="white"
        />
      </Box>
    </BlueBox>
  )
}

export default Decision
