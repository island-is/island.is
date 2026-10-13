import { useContext } from 'react'

import {
  isCompletedCase,
  isDefenceUser,
} from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

interface Props {
  displayVerdictViewDate?: boolean
  onProsecutorClick?: () => void
  displayOpenCaseReference?: boolean
}

const InfoCardActiveIndictment: React.FC<Props> = (props) => {
  const {
    displayVerdictViewDate,
    displayOpenCaseReference,
    onProsecutorClick,
  } = props
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const {
    defendants,
    cancelledAndDismissedDefendants,
    indictmentCreated,
    prosecutor,
    policeCaseNumbers,
    court,
    offenses,
    registrar,
    judge,
    civilClaimants,
    courtCaseNumber,
    linkedCaseSections,
  } = useInfoCardItems()

  const excludedDefendants =
    isDefenceUser(user) && isCompletedCase(workingCase.state)
      ? []
      : workingCase.defendants?.filter(
          (defendant) => defendant.indictmentCancelledOrDismissedState !== null,
        )

  return (
    <InfoCard
      sections={[
        {
          id: 'defendant-section',
          items: [
            defendants({
              caseType: workingCase.type,
              displayVerdictViewDate,
              displayOpenCaseReference,
            }),
          ],
        },
        ...(workingCase.hasCivilClaims
          ? [{ id: 'civil-claimant-section', items: [civilClaimants] }]
          : []),
        {
          id: 'case-info-section',
          items: [
            indictmentCreated,
            prosecutor(workingCase.type, onProsecutorClick),
            ...(workingCase.indictmentApprover
              ? [
                  {
                    id: 'indictment-approver-item',
                    title: 'Yfirlesari',
                    values: [workingCase.indictmentApprover.name ?? ''],
                  },
                ]
              : []),
            policeCaseNumbers,
            ...(workingCase.judge ? [judge] : []),
            ...(workingCase.registrar ? [registrar] : []),
            court,
            courtCaseNumber,
            offenses,
          ],
          columns: 2,
        },
        ...linkedCaseSections,
        ...(isNonEmptyArray(excludedDefendants)
          ? [
              {
                id: 'cancelled-and-dismissed-defendants-section',
                items:
                  excludedDefendants.map((defendant) =>
                    cancelledAndDismissedDefendants(defendant),
                  ) || [],
                columns: 2,
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardActiveIndictment
