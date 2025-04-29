import React from 'react'
import { useIntl } from 'react-intl'
import { Text, UploadFileDeprecated } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'
import { FAFieldBaseProps, OverrideAnswerSchema, UploadFileType } from '../..'
import { Files } from '..'

const IncomeFilesForm = ({ field, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(
          externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.success
            ? incomeFilesForm.general.descriptionTaxSuccess
            : incomeFilesForm.general.description,
        )}
      </Text>
      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={
          answers[
            field.id as keyof OverrideAnswerSchema
          ] as UploadFileDeprecated[]
        }
        folderId={id}
      />
    </>
  )
}

export default IncomeFilesForm
