import React from 'react'
import { useIntl } from 'react-intl'
import { Text, UploadFile, Box } from '@island.is/island-ui/core'
import { taxReturnForm } from '../../lib/messages'

import { FAFieldBaseProps, OverrideAnswerSchema, UploadFileType } from '../..'

import { DescriptionText, Files } from '..'

const TaxReturnFilesForm = ({ field, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers } = application

  return (
    <>
      {/* TODO alertbox */}
      <Box marginBottom={[3, 3, 5]}>
        <DescriptionText text={taxReturnForm.general.description} />
      </Box>

      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={
          answers[field.id as keyof OverrideAnswerSchema] as UploadFile[]
        }
        folderId={id}
      />
      <Text as="h2" variant="h3" marginBottom={2}>
        {formatMessage(taxReturnForm.instructions.findTaxReturnTitle)}
      </Text>
      <DescriptionText text={taxReturnForm.instructions.findTaxReturn} />

      <Text as="h2" variant="h3" marginBottom={2}>
        {formatMessage(taxReturnForm.instructions.findDirectTaxPaymentsTitle)}
      </Text>

      <Text marginBottom={[3, 3, 10]}>
        {formatMessage(taxReturnForm.instructions.findDirectTaxPayments)}
      </Text>
    </>
  )
}

export default TaxReturnFilesForm
