import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Text } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'

import { NO, YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { YesOrNo } from '../../types'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'

export const SelfEmployed: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  error,
}) => {
  const { setValue, register } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title, description } = field
  const { isSelfEmployed, isReceivingUnemploymentBenefits } =
    getApplicationAnswers(application.answers)

  const [defaultValue, setHiddenSelfEmployed] = useState(isSelfEmployed ?? NO)
  const hiddenReceivingUnemploymentbenefits =
    isReceivingUnemploymentBenefits ?? NO

  useEffect(() => {
    setHiddenSelfEmployed(isSelfEmployed ?? NO)
  }, [])

  return (
    <>
      <Text variant="h2" as="h2">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={error}
        application={application}
        field={{
          ...field,
          id: id,
          title: '',
          description,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          width: 'half',
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            const option = s as YesOrNo
            if (s === YES) {
              setValue('isReceivingUnemploymentBenefits', NO)
            }
            if (s !== YES) {
              setValue('fileUpload.selfEmployedFile', null)
              setValue('isReceivingUnemploymentBenefits', NO)
            }
            setHiddenSelfEmployed(option)
          },
          defaultValue,
        }}
      />
      <input type="hidden" value={defaultValue} {...register(id)} />
      <input
        type="hidden"
        value={hiddenReceivingUnemploymentbenefits}
        {...register('isReceivingUnemploymentBenefits')}
      />
    </>
  )
}
