import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './TextWithTooltip.css'
import { Locale } from '@island.is/shared/types'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

export const TextWithTooltip = ({
  application,
  field,
  title = '',
  description = '',
}: Props) => {
  const { formatMessage, lang: locale } = useLocale()

  return (
    <Box paddingTop={2} className={styles.marginFix}>
      <Text as="span">
        {formatTextWithLocale(
          field.title ? field.title : title,
          application,
          locale as Locale,
          formatMessage,
        )}{' '}
        <Tooltip
          placement="top"
          text={formatTextWithLocale(
            field.description ? field.description : description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      </Text>
    </Box>
  )
}
