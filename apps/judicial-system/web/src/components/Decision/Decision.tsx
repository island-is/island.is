import type { FC } from 'react'
import { useState } from 'react'

import { RadioButton } from '@island.is/island-ui/core'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

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
      <RadioGroup legend="Lyktir máls" hideLegend className={stack({ gap: 2 })}>
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
        {workingCase.type !== CaseType.TRAVEL_BAN && (
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
        )}
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
        {(workingCase.type === CaseType.CUSTODY ||
          workingCase.type === CaseType.ADMISSION_TO_FACILITY) && (
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
        )}
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
      </RadioGroup>
    </BlueBox>
  )
}

export default Decision
