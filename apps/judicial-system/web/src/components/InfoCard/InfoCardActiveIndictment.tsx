import { useContext } from 'react'

import { isCompletedCase, isDefenceUser } from '@island.is/judicial-system/types'

import { isNonEmptyArray } from '../../utils/arrayHelpers'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'
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
    mergedCasePoliceCaseNumbers,
    mergedCaseCourtCaseNumber,
    mergedCaseProsecutor,
    mergedCaseJudge,
    mergedCaseCourt,
    civilClaimants,
    courtCaseNumber,
    splitCases,
    splitCase,
    showItem,
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
            ...(showItem(indictmentCreated) ? [indictmentCreated] : []),
            prosecutor(workingCase.type, onProsecutorClick),
            policeCaseNumbers,
            ...(workingCase.judge ? [judge] : []),
            ...(workingCase.registrar ? [registrar] : []),
            court,
            ...(showItem(courtCaseNumber) ? [courtCaseNumber] : []),
            offenses,
          ],
          columns: 2,
        },
        ...(isNonEmptyArray(workingCase.mergedCases)
          ? workingCase.mergedCases.map((mergedCase) => ({
              id: mergedCase.id,
              items: [
                mergedCasePoliceCaseNumbers(mergedCase),
                mergedCaseCourtCaseNumber(mergedCase),
                mergedCaseProsecutor(mergedCase),
                mergedCaseJudge(mergedCase),
                mergedCaseCourt(mergedCase),
              ],
              columns: 2,
            }))
          : []),
        ...(isNonEmptyArray(workingCase.splitCases)
          ? [{ id: 'split-cases-section', items: [splitCases], columns: 2 }]
          : []),
        ...(workingCase.splitCase
          ? [{ id: 'split-case-section', items: [splitCase], columns: 2 }]
          : []),
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
