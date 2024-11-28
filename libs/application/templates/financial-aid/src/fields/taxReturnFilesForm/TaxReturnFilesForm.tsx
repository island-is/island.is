import React from 'react'
import { useIntl } from 'react-intl'
import { UploadFile, Box, AlertMessage } from '@island.is/island-ui/core'
import { taxReturnForm } from '../../lib/messages'
import { TaxData, UploadFileType } from '../..'
import { FieldBaseProps } from '@island.is/application/types'
import Files from '../files/Files'
import { getValueViaPath } from '@island.is/application/core'
import { getTaxFormContent } from './TaxFormContent'

export const TaxReturnFilesForm = ({ field, application }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData, assignees } = application
  const nationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )
  const taxData = getValueViaPath<TaxData>(externalData, 'taxData.data')
  const spouseTaxData = getValueViaPath<TaxData>(
    externalData,
    'taxDataSpouse.data',
  )

  const taxDataToUse =
    assignees.includes(nationalId ?? '') && spouseTaxData
      ? spouseTaxData
      : taxData

  if (!taxDataToUse) {
    return null
  }

  const { municipalitiesDirectTaxPayments, municipalitiesPersonalTaxReturn } =
    taxDataToUse

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
        uploadFiles={answers[field.id] as unknown as UploadFile[]}
        folderId={id}
      />

      {content.info}
    </>
  )
}
