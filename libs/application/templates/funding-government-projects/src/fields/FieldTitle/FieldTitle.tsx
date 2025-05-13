import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { ResponsiveSpace, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'

type Props = FieldBaseProps & {
  field: {
    props: {
      marginTop?: ResponsiveSpace
      required?: boolean
    }
  }
}

export const FieldTitle = ({ field, application }: Props) => {
  const { formatMessage, lang: locale } = useLocale()
  return (
    <>
      <Text
        variant="h4"
        marginTop={field.props.marginTop || 0}
        marginBottom={field.description ? 1 : 0}
      >
        {formatTextWithLocale(
          field.title ?? '',
          application,
          locale as Locale,
          formatMessage,
        )}
        {field.props.required && (
          <Text variant="h4" color="red400" as="span">
            {' *'}
          </Text>
        )}
      </Text>
      {field.description && (
        <Text>
          {formatTextWithLocale(
            field.description,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}
    </>
  )
}
