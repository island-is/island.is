import React, { useContext } from 'react'

import { Text, UploadFile } from '@island.is/island-ui/core'
import { incomeFilesForm } from '../../lib/messages'

import { FAFieldBaseProps } from '../..'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { Files } from '..'

const IncomeFilesForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  const { setValue } = useFormContext()

  const incomeFiles: UploadFile[] = []

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(incomeFilesForm.general.description)}
      </Text>
      <Files fileKey="incomeFiles" uploadFiles={incomeFiles} />
    </>
  )
}

export default IncomeFilesForm
