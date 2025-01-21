import { FieldComponents, FieldTypes } from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Application, Field } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { MessageDescriptor } from 'react-intl'

interface DynamicDisabledTextProps {
  application: Application
  field: Field & {
    props: {
      descriptor:
        | MessageDescriptor
        | ((application: Application) => MessageDescriptor)
      values?: (
        application: Application,
        lang: Locale,
      ) => {
        [key: string]: string
      }
    }
  }
}

const DynamicDisabledText: FC<DynamicDisabledTextProps> = ({
  field,
  application,
}) => {
  const { lang, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const {
    title,
    id,
    width,
    props: { descriptor, values },
  } = field

  const computedValues = values?.(application, lang)

  const message =
    typeof descriptor === 'function' ? descriptor(application) : descriptor
  const formattedMessage = formatMessage(message, computedValues)

  useEffect(() => {
    setValue(id, formattedMessage)
  }, [id, formattedMessage, setValue])

  return (
    <TextFormField
      application={application}
      showFieldName
      field={{
        id,
        disabled: true,
        defaultValue: formattedMessage,
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
