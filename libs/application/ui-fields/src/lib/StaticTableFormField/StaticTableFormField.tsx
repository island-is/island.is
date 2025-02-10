import { FieldBaseProps, StaticTableField } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: StaticTableField
}

export const StaticTableFormField: FC<Props> = ({
  field,
  application,
  showFieldName,
}) => {
  const {
    marginTop,
    marginBottom,
    description,
    title = '',
    titleVariant,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const header =
    typeof field.header === 'function'
      ? field.header(application)
      : field.header
  const rows =
    typeof field.rows === 'function' ? field.rows(application) : field.rows
  const summary =
    typeof field.summary === 'function'
      ? field.summary(application)
      : field.summary

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {showFieldName && (
        <Text variant={titleVariant} marginBottom={2}>
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
      <Box marginTop={description ? 3 : 0}>
        <T.Table>
          <T.Head>
            <T.Row>
              {header.map((cell, index) => (
                <T.HeadData key={`${cell}-${index}`}>
                  {formatText(cell, application, formatMessage)}
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((row, rowIndex) => (
              <T.Row key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <T.Data key={`row-${rowIndex}-cell-${cellIndex}`}>
                    {formatText(cell, application, formatMessage)}
                  </T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
        {summary &&
          summary.map((s, index) => (
            <Box
              key={`summary-${index}`}
              marginTop={3}
              display={['block', 'block', 'flex']}
              justifyContent="spaceBetween"
              alignItems="center"
              padding={3}
              borderRadius="large"
              background="blue100"
            >
              <Text
                variant="medium"
                fontWeight="semiBold"
                marginBottom={[1, 1, 0]}
              >
                {formatText(s.label, application, formatMessage)}
              </Text>
              <Text variant="h3" as="span" color="blue400">
                {formatText(s.value, application, formatMessage)}
              </Text>
            </Box>
          ))}
      </Box>
    </Box>
  )
}
