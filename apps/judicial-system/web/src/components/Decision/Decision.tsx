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
  disabled?: boolean
}

const Decision: React.FC<Props> = ({
  workingCase,
  acceptedLabelText,
  acceptingAlternativeTravelBanLabelText,
  rejectedLabelText,
  partiallyAcceptedLabelText,
  dismissLabelText,
  onChange,
  disabled = false,
}) => {
  return (
    <BlueBox>
      <Box marginBottom={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-accepting"
          label={acceptedLabelText}
          checked={workingCase.decision === CaseDecision.Accepting}
          onChange={() => {
            onChange(CaseDecision.Accepting)
          }}
          large
          backgroundColor="white"
          disabled={disabled}
        />
      </Box>
      {workingCase.type !== CaseType.TravelBan && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-partially"
            label={partiallyAcceptedLabelText}
            checked={workingCase.decision === CaseDecision.AcceptingPartially}
            onChange={() => {
              onChange(CaseDecision.AcceptingPartially)
            }}
            large
            backgroundColor="white"
            disabled={disabled}
          />
        </Box>
      )}
      <Box marginTop={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-rejecting"
          label={rejectedLabelText}
          checked={workingCase.decision === CaseDecision.Rejecting}
          onChange={() => {
            onChange(CaseDecision.Rejecting)
          }}
          large
          backgroundColor="white"
          disabled={disabled}
        />
      </Box>
      {(workingCase.type === CaseType.Custody ||
        workingCase.type === CaseType.AdmissionToFacility) && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-alternative-travel-ban"
            label={acceptingAlternativeTravelBanLabelText}
            checked={
              workingCase.decision ===
              CaseDecision.AcceptingAlternativeTravelBan
            }
            onChange={() => {
              onChange(CaseDecision.AcceptingAlternativeTravelBan)
            }}
            large
            backgroundColor="white"
            disabled={disabled}
          />
        </Box>
      )}
      <Box marginTop={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-dismissing"
          label={dismissLabelText}
          checked={workingCase.decision === CaseDecision.Dismissing}
          onChange={() => {
            onChange(CaseDecision.Dismissing)
          }}
          large
          backgroundColor="white"
          disabled={disabled}
        />
      </Box>
    </BlueBox>
  )
}

export default Decision
