import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../forms/messages'

const AddMissingInfo: FC<FieldBaseProps> = ({ application }) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const missingInfo = getValueViaPath(
    application.answers,
    'missingInfo',
  ) as string[]

  let index = 0
  if (missingInfo.length > 0) {
    index = missingInfo.length
  }

  return (
    <Input
      id={`missingInfo[${index}].remarks`}
      name={`missingInfo[${index}].remarks`}
      label={formatText(m.additionalRemarks, application, formatMessage)}
      placeholder={formatText(
        m.additionalRemarksPlaceholder,
        application,
        formatMessage,
      )}
      ref={register}
      // disabled={!isEditable}
      textarea
    />
  )
}

export default AddMissingInfo
