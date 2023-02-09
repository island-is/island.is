import React from 'react'
import { Box, RadioButton } from '@island.is/island-ui/core'
import { CaseDecision } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

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
          checked={workingCase.decision === CaseDecision.ACCEPTING}
          onChange={() => {
            onChange(CaseDecision.ACCEPTING)
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
            checked={workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY}
            onChange={() => {
              onChange(CaseDecision.ACCEPTING_PARTIALLY)
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
          checked={workingCase.decision === CaseDecision.REJECTING}
          onChange={() => {
            onChange(CaseDecision.REJECTING)
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
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            }
            onChange={() => {
              onChange(CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
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
          checked={workingCase.decision === CaseDecision.DISMISSING}
          onChange={() => {
            onChange(CaseDecision.DISMISSING)
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
