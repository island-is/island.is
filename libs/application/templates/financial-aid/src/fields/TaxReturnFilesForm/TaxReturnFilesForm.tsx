import React from 'react'
import { useIntl } from 'react-intl'
import {
  UploadFileDeprecated,
  Box,
  AlertMessage,
} from '@island.is/island-ui/core'
import { taxReturnForm } from '../../lib/messages'

import { FAFieldBaseProps, OverrideAnswerSchema, UploadFileType } from '../..'

import { Files } from '..'
import { getTaxFormContent } from './taxFormContent'

const TaxReturnFilesForm = ({ field, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData, assignees } = application

  const { municipalitiesDirectTaxPayments, municipalitiesPersonalTaxReturn } =
    assignees.includes(externalData.nationalRegistry.data.nationalId) &&
    externalData?.taxDataSpouse?.data
      ? externalData.taxDataSpouse.data
      : externalData.taxData.data

  const taxReturnFetchFailed =
    municipalitiesPersonalTaxReturn?.personalTaxReturn === null
  const directTaxPaymentsFetchedFailed =
    municipalitiesDirectTaxPayments.directTaxPayments.length === 0 &&
    !municipalitiesDirectTaxPayments.success
  const taxDataGatheringFailed =
    taxReturnFetchFailed && directTaxPaymentsFetchedFailed

  const content = getTaxFormContent(
    taxReturnFetchFailed,
    directTaxPaymentsFetchedFailed,
  )

  return (
    <>
      {taxDataGatheringFailed && (
        <Box marginBottom={4} marginTop={2}>
          <AlertMessage
            type="error"
            title={formatMessage(taxReturnForm.alertMessage.title)}
            message={formatMessage(taxReturnForm.alertMessage.title)}
          />
        </Box>
      )}

      {content.data}

      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={
          answers[
            field.id as keyof OverrideAnswerSchema
          ] as UploadFileDeprecated[]
        }
        folderId={id}
      />

      {content.info}
    </>
  )
}

export default TaxReturnFilesForm
