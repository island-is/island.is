import React from 'react'

import { Text, UploadFile } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'

import { FAFieldBaseProps } from '../..'
import { useIntl } from 'react-intl'
import { Files } from '..'

const IncomeFilesForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(incomeFilesForm.general.description)}
      </Text>
      <Files
        fileKey="incomeFiles"
        uploadFiles={answers?.incomeFiles as UploadFile[]}
        folderId={id}
      />
    </>
  )
}

export default IncomeFilesForm
