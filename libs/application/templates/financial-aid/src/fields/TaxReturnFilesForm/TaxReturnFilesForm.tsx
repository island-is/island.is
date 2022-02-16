import React, { useContext } from 'react'

import { Text, UploadFile } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'

import { FAFieldBaseProps } from '../..'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { Files } from '..'

const TaxReturnFilesForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id } = application

  const taxReturnFiles: UploadFile[] = []

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(incomeFilesForm.general.description)}
      </Text>
      <Files
        fileKey="taxReturnFiles"
        uploadFiles={taxReturnFiles}
        folderId={id}
      />
    </>
  )
}

export default TaxReturnFilesForm
