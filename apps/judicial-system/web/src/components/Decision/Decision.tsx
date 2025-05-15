import { FC, useState } from 'react'

import { Box, RadioButton } from '@island.is/island-ui/core'
import {
  Case,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

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

const Decision: FC<Props> = ({
  workingCase,
  acceptedLabelText,
  acceptingAlternativeTravelBanLabelText,
  rejectedLabelText,
  partiallyAcceptedLabelText,
  dismissLabelText,
  onChange,
  disabled = false,
}) => {
  const [checkedRadio, setCheckedRadio] = useState<CaseDecision>()

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <RadioButton
          name="case-decision"
          id="case-decision-accepting"
          label={acceptedLabelText}
          checked={
            checkedRadio === CaseDecision.ACCEPTING ||
            (!checkedRadio && workingCase.decision === CaseDecision.ACCEPTING)
          }
          onChange={() => {
            setCheckedRadio(CaseDecision.ACCEPTING)
            onChange(CaseDecision.ACCEPTING)
          }}
          large
          backgroundColor="white"
          disabled={disabled}
        />
      </Box>
      {workingCase.type !== CaseType.TRAVEL_BAN && (
        <Box marginTop={2}>
          <RadioButton
            name="case-decision"
            id="case-decision-accepting-partially"
            label={partiallyAcceptedLabelText}
            checked={
              checkedRadio === CaseDecision.ACCEPTING_PARTIALLY ||
              (!checkedRadio &&
                workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY)
            }
            onChange={() => {
              setCheckedRadio(CaseDecision.ACCEPTING_PARTIALLY)
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
          checked={
            checkedRadio === CaseDecision.REJECTING ||
            (!checkedRadio && workingCase.decision === CaseDecision.REJECTING)
          }
          onChange={() => {
            setCheckedRadio(CaseDecision.REJECTING)
            onChange(CaseDecision.REJECTING)
          }}
          large
          backgroundColor="white"
          disabled={disabled}
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
              checkedRadio === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
              (!checkedRadio &&
                workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
            }
            onChange={() => {
              setCheckedRadio(CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
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
          checked={
            checkedRadio === CaseDecision.DISMISSING ||
            (!checkedRadio && workingCase.decision === CaseDecision.DISMISSING)
          }
          onChange={() => {
            setCheckedRadio(CaseDecision.DISMISSING)
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
