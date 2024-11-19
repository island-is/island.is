import React from 'react'
import { useIntl } from 'react-intl'
import { Text, UploadFile } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'
import { UploadFileType } from '../..'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import Files from '../files/Files'

export const IncomeFilesForm = ({ field, application }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData } = application
  const success = getValueViaPath<string>(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.success',
  )
  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(
          success
            ? incomeFilesForm.general.descriptionTaxSuccess
            : incomeFilesForm.general.description,
        )}
      </Text>
      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={answers[field.id] as unknown as UploadFile[]}
        folderId={id}
      />
    </>
  )
}
