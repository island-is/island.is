import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { UniversityAnswers } from '../..'
import { getValueViaPath } from '@island.is/application/core'
import { useGetProgramQuery } from '../../hooks/useGetProgramQuery'
import { UniversityGatewayProgramExtraApplicationField } from '@island.is/api/schema'
import { FieldType } from '@island.is/university-gateway'
import { FileUploadFormField } from '@island.is/application/ui-fields'
import { FileUploadController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { formerEducation } from '../../lib/messages/formerEducation'
import { Box } from '@island.is/island-ui/core'

export const OtherDocuments: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { lang, formatMessage } = useLocale()
  const answers = application.answers as UniversityAnswers
  const chosenProgram = getValueViaPath(
    answers,
    'programInformation.program',
    '',
  )
  const [extraApplicationUploadFields, setExtraApplicationUploadFields] =
    useState<Array<UniversityGatewayProgramExtraApplicationField>>([])

  useEffect(() => {
    if (chosenProgram) {
      getProgramDetailsCallback({ id: chosenProgram }).then((response) => {
        const allExtraApplicationFields =
          response.universityGatewayProgram.extraApplicationFields
        const onlyUploadFields = allExtraApplicationFields.filter(
          (x) => x.fieldType === FieldType.UPLOAD,
        )
        setExtraApplicationUploadFields(onlyUploadFields)
      })
    }
  }, [])

  const getProgramDetails = useGetProgramQuery()
  const getProgramDetailsCallback = useCallback(
    async ({ id }: { id: string }) => {
      const { data } = await getProgramDetails({
        input: {
          id,
        },
      })
      return data
    },
    [getProgramDetails],
  )

  return extraApplicationUploadFields.map((uploadField, index) => {
    return (
      <Box marginTop={1} marginBottom={2}>
        <FileUploadController
          id={field.id}
          key={index}
          application={application}
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
