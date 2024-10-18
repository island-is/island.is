import { useContext } from 'react'

import { FormContext } from '../FormProvider/FormProvider'
import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

const InfoCardActiveIndictment = () => {
  const { workingCase } = useContext(FormContext)
  const {
    defendants,
    indictmentCreated,
    prosecutor,
    policeCaseNumbers,
    court,
    offences,
    mergedCasePoliceCaseNumbers,
    mergedCaseCourtCaseNumber,
    mergedCaseProsecutor,
    mergedCaseJudge,
    mergedCaseCourt,
    civilClaimants,
  } = useInfoCardItems()

  return (
    <InfoCard
      sections={[
        {
          id: 'defendant-section',
          items: [defendants(workingCase.type)],
        },
        ...(workingCase.hasCivilClaims
          ? [{ id: 'civil-claimant-section', items: [civilClaimants] }]
          : []),
        {
          id: 'case-info-section',
          items: [
            indictmentCreated,
            prosecutor(workingCase.type),
            policeCaseNumbers,
            court,
            offences,
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
      ]}
    />
  )
}

export default InfoCardActiveIndictment
