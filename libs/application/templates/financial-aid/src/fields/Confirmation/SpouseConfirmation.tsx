import React from 'react'

import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { confirmation } from '../../lib/messages'
import { hasFiles } from '../../lib/utils'
import Confirmation from './Confirmation'

const SpouseConfirmation = ({ application }: FAFieldBaseProps) => {
  const { answers, externalData } = application

  const missingIncomeFiles =
    answers.spouseIncome === ApproveOptions.Yes &&
    !hasFiles('spouseIncomeFiles', answers)

  return (
    <Confirmation
      firstStepText={
        missingIncomeFiles
          ? confirmation.nextSteps.contentMissingFiles
          : undefined
      }
      missingIncomeFiles={missingIncomeFiles}
      municipalityHomepage={
        externalData?.nationalRegistry?.data?.municipality?.homepage
      }
    />
  )
}

export default SpouseConfirmation
