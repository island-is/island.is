import type { FC } from 'react'
import { useContext } from 'react'

import { isInvestigationCase } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

interface Props {
  // Shows what was asked for while the request is still before the court: the
  // requested court date and, for restriction cases, the arrest date or the
  // expiry of the restriction being extended.
  displayRequestDetails?: boolean
  onProsecutorClick?: () => void
}

const InfoCardRequestCase: FC<Props> = (props) => {
  const { displayRequestDetails, onProsecutorClick } = props
  const { workingCase } = useContext(FormContext)
  const {
    defendants,
    victims,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutorsOffice,
    court,
    prosecutor,
    judge,
    requestedCourtDate,
    caseType,
    parentCaseValidToDate,
    registrar,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
  } = useInfoCardItems()

  const isInvestigation = isInvestigationCase(workingCase.type)
  const appealCase = workingCase.appealCase
  const hasAllAppealJudges = Boolean(
    appealCase?.appealJudge1 &&
      appealCase?.appealJudge2 &&
      appealCase?.appealJudge3,
  )

  return (
    <InfoCard
      sections={[
        {
          id: 'defendants-section',
          items: [defendants({ caseType: workingCase.type })],
        },
        { id: 'victims-section', items: [victims] },
        {
          id: 'case-info-section',
          items: [
            policeCaseNumbers,
            courtCaseNumber,
            prosecutorsOffice,
            court,
            prosecutor(workingCase.type, onProsecutorClick),
            ...(workingCase.judge ? [judge] : []),
            ...(displayRequestDetails ? [requestedCourtDate] : []),
            ...(isInvestigation ? [caseType] : []),
            ...(displayRequestDetails && !isInvestigation
              ? [parentCaseValidToDate]
              : []),
            ...(workingCase.registrar ? [registrar] : []),
          ],
          columns: 2,
        },
        ...(appealCase?.appealCaseNumber
          ? [
              {
                id: 'court-of-appeal-section',
                items: [
                  appealCaseNumber,
                  appealAssistant,
                  ...(hasAllAppealJudges ? [appealJudges] : []),
                ],
                columns: 2,
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardRequestCase
