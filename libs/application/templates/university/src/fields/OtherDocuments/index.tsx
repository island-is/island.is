import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { UniversityAnswers } from '../..'
import { UniversityGatewayProgramExtraApplicationField } from '@island.is/api/schema'
import { FileUploadController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { formerEducation } from '../../lib/messages/formerEducation'
import { Box } from '@island.is/island-ui/core'
import { getChosenProgram } from '../../utils/getChosenProgram'

export const OtherDocuments: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { lang, formatMessage } = useLocale()
  const answers = application.answers as UniversityAnswers
  const externalData = application.externalData

  const [extraApplicationUploadFields, setExtraApplicationUploadFields] =
    useState<Array<UniversityGatewayProgramExtraApplicationField>>([])

  useEffect(() => {
    const chosenProgramData = getChosenProgram(externalData, answers)
    chosenProgramData?.extraApplicationFields &&
      setExtraApplicationUploadFields(chosenProgramData?.extraApplicationFields)
  }, [])

  // TODO display different type of fields
  return extraApplicationUploadFields.map((uploadField, index) => {
    return (
      <Box marginTop={1} marginBottom={2} key={index}>
        <FileUploadController
          id={`${field.id}[${index}].attachments`}
          key={index}
          application={application}
          multiple={false}
          header={lang === 'is' ? uploadField.nameIs : uploadField.nameEn}
          description={
            lang === 'is' && uploadField.descriptionIs
              ? uploadField.descriptionIs
              : uploadField.descriptionEn
              ? uploadField.descriptionEn
              : ''
          }
          buttonLabel={formatMessage(
            formerEducation.labels.educationDetails.degreeFileUploadButtonLabel,
          )}
        />
      </Box>
    )
  })
}
