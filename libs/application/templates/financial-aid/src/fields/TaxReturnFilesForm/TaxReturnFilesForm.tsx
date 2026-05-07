import React from 'react'
import { useIntl } from 'react-intl'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/application/ui-components'
import { Application } from '@island.is/application/types'
import { filesText, taxReturnForm } from '../../lib/messages'

import { FAFieldBaseProps } from '../..'

import { getTaxFormContent } from './taxFormContent'

const TaxReturnFilesForm = ({
  field,
  application,
  error,
}: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { externalData, assignees } = application

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

      <FileUploadController
        id={field.id}
        application={application as unknown as Application}
        error={typeof error === 'string' ? error : undefined}
        header={formatMessage(filesText.header)}
        description={formatMessage(filesText.description)}
        buttonLabel={formatMessage(filesText.buttonLabel)}
        multiple
      />

      {content.info}
    </>
  )
}

export default TaxReturnFilesForm
