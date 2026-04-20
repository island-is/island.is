import { useContext } from 'react'

import { FormContext } from '../FormProvider/FormProvider'
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
  const {
    defendants,
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
        ...(workingCase.mergedCases && workingCase.mergedCases.length > 0
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
        ...(workingCase.splitCases && workingCase.splitCases.length > 0
          ? [{ id: 'split-cases-section', items: [splitCases], columns: 2 }]
          : []),
        ...(workingCase.splitCase
          ? [{ id: 'split-case-section', items: [splitCase], columns: 2 }]
          : []),
      ]}
    />
  )
}

export default InfoCardActiveIndictment
