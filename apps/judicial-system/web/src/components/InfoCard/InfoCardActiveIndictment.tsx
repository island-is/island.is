import React, { useContext } from 'react'

import { FormContext } from '../FormProvider/FormProvider'
import InfoCardNew from './InfoCardNew'
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
  } = useInfoCardItems()

  return (
    <InfoCardNew
      sections={[
        ...(workingCase.defendants
          ? [
              {
                id: 'defendant-section',
                items: [defendants],
              },
            ]
          : []),
        {
          id: 'case-info-section',
          items: [
            indictmentCreated,
            prosecutor,
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
