import React from 'react'

import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { confirmation } from '../../lib/messages'
import { hasFiles, hasSpouse } from '../../lib/utils'
import { isVeitaApplication } from '../../lib/summaryRoutes'
import Confirmation from './Confirmation'

const ApplicantConfirmation = ({ application }: FAFieldBaseProps) => {
  const { answers, externalData } = application

  const applicantHasSpouse = hasSpouse(answers, externalData)
  const missingIncomeFiles =
    answers.income === ApproveOptions.Yes &&
    !hasFiles('incomeFiles', answers) &&
    !hasFiles('rvkIncomeFiles', answers)

  // Veita applicants have no upload screen after submitting, so they are told
  // the municipality will reach out instead of pointing them at the status page.
  const isVeita = isVeitaApplication(application)

  const firstStepText = () => {
    switch (true) {
      case applicantHasSpouse && missingIncomeFiles:
        return isVeita
          ? confirmation.nextSteps.contentBothMissingFilesVeita
          : confirmation.nextSteps.contentBothMissingFiles
      case applicantHasSpouse:
        return confirmation.nextSteps.contentSpouseMissingFiles
      case missingIncomeFiles:
        return isVeita
          ? confirmation.nextSteps.contentMissingFilesVeita
          : confirmation.nextSteps.contentMissingFiles
    }
  }

  return (
    <Confirmation
      firstStepText={firstStepText()}
      missingIncomeFiles={missingIncomeFiles}
      hasSpouse={applicantHasSpouse}
      spouseEmailSuccess={
        application.externalData.sendSpouseEmail?.data.success
      }
      municipalityHomepage={externalData.municipality.data?.homepage}
      isVeita={isVeita}
    />
  )
}

export default ApplicantConfirmation
