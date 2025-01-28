import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  FormTextWithLocale,
} from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatTextWithLocale } from '@island.is/application/core'
import { Locale } from '@island.is/shared/types'

interface DynamicDisabledTextProps {
  field: {
    props: {
      value: FormTextWithLocale
    }
  }
}

const DynamicDisabledText: FC<
  React.PropsWithChildren<FieldBaseProps & DynamicDisabledTextProps>
> = ({ field, application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const {
    title,
    id,
    width,
    props: { value },
  } = field

  const defaultValue = formatTextWithLocale(
    value,
    application,
    locale as Locale,
    formatMessage,
  )

  useEffect(() => {
    setValue(id, defaultValue)
  }, [id, defaultValue, setValue])

  return (
    <TextFormField
      application={application}
      showFieldName
      field={{
        id,
        disabled: true,
        defaultValue,
        title,
        width,
        type: FieldTypes.TEXT,
        component: FieldComponents.TEXT,
        children: undefined,
      }}
    />
  )
}

export default DynamicDisabledText
