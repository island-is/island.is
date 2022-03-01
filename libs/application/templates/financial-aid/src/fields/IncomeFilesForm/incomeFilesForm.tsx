import React from 'react'
import { useIntl } from 'react-intl'
import { Text } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'
import { FAFieldBaseProps } from '../..'
import { Files } from '..'

const IncomeFilesForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(incomeFilesForm.general.description)}
      </Text>
      <Files
        fileKey="incomeFiles"
        uploadFiles={answers?.incomeFiles}
        folderId={id}
      />
    </>
  )
}

export default IncomeFilesForm
