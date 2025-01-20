import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import { getGenderMessage } from '../../lib/newPrimarySchoolUtils'
import { useFormContext } from 'react-hook-form'

const Gender: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { title, id, width, disabled } = field
  const genderMessage = getGenderMessage(application)

  const genderText = formatMessage(genderMessage)

  useEffect(() => {
    setValue(id, genderText)
  }, [id, genderText, setValue])

  return (
    <TextFormField
      application={application}
      showFieldName
      field={{
        id,
        disabled,
        defaultValue: genderText,
        title,
        width,
        type: FieldTypes.TEXT,
        component: FieldComponents.TEXT,
        children: undefined,
      }}
    />
  )
}

export default Gender
