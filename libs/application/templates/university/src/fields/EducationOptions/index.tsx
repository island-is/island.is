import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from '../Review/ApplicantReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { ProgramReview } from '../Review/ProgramReview'
import { SchoolCareerReview } from '../Review/SchoolCareerReview'
import { OtherDocumentsReview } from '../Review/OtherDocumentsReview'
import { useLazyApplicationQuery } from '../../hooks/useLazyApplicationQuery'
import {
  FieldDescription,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { formerEducation } from '../../lib/messages/formerEducation'
import { information } from '../../lib/messages'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { ProgramBase } from '@island.is/clients/university-gateway-api'

export const EducationOptions: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const externalData = application.externalData

  const optionAnswer = getValueViaPath(
    answers,
    `${Routes.EDUCATIONOPTIONS}`,
  ) as Array<string>
  const { formatMessage, lang } = useLocale()
  console.log('lang', lang)

  const programs = externalData.programs.data as Array<ProgramBase>

  //   const showExeption = programs.filter(
  //     (x) => x.id === answers.programInformation.program,
  //   )[0].allowException

  const options = [
    {
      label: formatMessage(
        formerEducation.labels.educationOptions.diplomaFinishedLabel,
      ),
      subLabel: formatMessage(
        formerEducation.labels.educationOptions.diplomaFinishedDescription,
      ),
      value: 'diploma',
    },
    {
      label: formatMessage(
        formerEducation.labels.educationOptions.diplomaNotFinishedLabel,
      ),
      subLabel: formatMessage(
        formerEducation.labels.educationOptions.diplomaNotFinishedDescription,
      ),
      value: 'notFinished',
    },
    {
      label: formatMessage(
        formerEducation.labels.educationOptions.exemptionLabel,
      ),
      subLabel: formatMessage(
        formerEducation.labels.educationOptions.exemptionDescription,
      ),
      value: 'exemption',
    },
    {
      label: formatMessage(
        formerEducation.labels.educationOptions.thirdLevelLabel,
      ),
      subLabel: formatMessage(
        formerEducation.labels.educationOptions.thirdLevelDescription,
      ),
      value: 'thirdLevel',
    },
  ]
  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          formerEducation.labels.educationOptions.pageDescription,
        )}
      />
      <Box marginTop={2}>
        <RadioController
          id={`${Routes.EDUCATIONOPTIONS}`}
          defaultValue={optionAnswer}
          backgroundColor="blue"
          largeButtons
          options={options}
        />
      </Box>
    </Box>
  )
}
