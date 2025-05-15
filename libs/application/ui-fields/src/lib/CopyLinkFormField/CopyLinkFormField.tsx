import { CopyLinkField, FieldBaseProps } from '@island.is/application/types'
import { CopyLink as Copy } from '@island.is/application/ui-components'
import { Text, Box } from '@island.is/island-ui/core'
import { formatTextWithLocale } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: CopyLinkField
}

export const CopyLinkFormField = ({
  field,
  showFieldName,
  application,
}: Props) => {
  const {
    id,
    link,
    marginTop,
    marginBottom,
    title,
    description,
    semiBoldLink,
    buttonTitle,
  } = field
  const { formatMessage, lang: locale } = useLocale()

  return (
    <Box
      marginTop={marginTop}
      marginBottom={marginBottom ?? 2}
      role="region"
      aria-labelledby={id + 'title'}
    >
      {showFieldName && title && (
        <Text
          variant="h4"
          as="h4"
          id={id + 'title'}
          marginBottom={description ? 0 : 2}
        >
          {formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}

      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}
      <Box>
        <Copy
          linkUrl={formatTextWithLocale(
            link,
            application,
            locale as Locale,
            formatMessage,
          )}
          buttonTitle={
            buttonTitle &&
            formatTextWithLocale(
              buttonTitle,
              application,
              locale as Locale,
              formatMessage,
            )
          }
          semiBoldLink={semiBoldLink}
        />
      </Box>
    </Box>
  )
}
