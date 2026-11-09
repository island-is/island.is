import React from 'react'

import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { confirmation } from '../../lib/messages'
import { hasFiles } from '../../lib/utils'
import { isVeitaApplication } from '../../lib/summaryRoutes'
import Confirmation from './Confirmation'

const SpouseConfirmation = ({ application }: FAFieldBaseProps) => {
  const { answers, externalData } = application

  const missingIncomeFiles =
    answers.spouseIncome === ApproveOptions.Yes &&
    !hasFiles('spouseIncomeFiles', answers) &&
    !hasFiles('rvkSpouseIncomeFiles', answers)

  const isVeita = isVeitaApplication(application)

  const firstStepText = () => {
    if (!missingIncomeFiles) {
      return undefined
    }
    return isVeita
      ? confirmation.nextSteps.contentMissingFilesVeita
      : confirmation.nextSteps.contentMissingFiles
  }

  return (
    <Confirmation
      firstStepText={firstStepText()}
      missingIncomeFiles={missingIncomeFiles}
      municipalityHomepage={externalData.municipality.data?.homepage}
      isVeita={isVeita}
    />
  )
}

export default SpouseConfirmation
