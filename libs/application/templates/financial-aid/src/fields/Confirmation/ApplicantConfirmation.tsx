import React from 'react'

import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { confirmation } from '../../lib/messages'
import { hasFiles, hasSpouse } from '../../lib/utils'
import Confirmation from './Confirmation'

const ApplicantConfirmation = ({ application }: FAFieldBaseProps) => {
  const { answers, externalData } = application

  const applicantHasSpouse = hasSpouse(answers, externalData)
  const missingIncomeFiles =
    answers.income === ApproveOptions.Yes && !hasFiles('incomeFiles', answers)

  let firstStepText
  if (applicantHasSpouse && missingIncomeFiles) {
    firstStepText = confirmation.nextSteps.contentBothMissingFiles
  } else if (applicantHasSpouse) {
    firstStepText = confirmation.nextSteps.contentSpouseMissingFiles
  } else if (missingIncomeFiles) {
    firstStepText = confirmation.nextSteps.contentMissingFiles
  }

  return (
    <Confirmation
      firstStepText={firstStepText}
      missingIncomeFiles={missingIncomeFiles}
      hasSpouse={applicantHasSpouse}
      municipalityHomepage={
        externalData?.nationalRegistry?.data?.municipality?.homepage
      }
    />
  )
}

export default ApplicantConfirmation
