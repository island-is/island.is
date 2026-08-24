import { FieldBaseProps, StaticTableField } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Box, Checkbox, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatText,
  formatTextWithLocale,
  getValueViaPath,
  resolveFieldId,
} from '@island.is/application/core'
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
    selectable,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const { watch, setValue, register, unregister } = useFormContext()
  const fieldId = resolveFieldId({ id: field.id }, application, user)

  useEffect(() => {
    if (!selectable) {
      return
    }
    register(fieldId)
    return () => unregister(fieldId)
  }, [selectable, fieldId, register, unregister])

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

  const selected: number[] = selectable
    ? watch(fieldId) ??
      getValueViaPath<number[]>(application.answers, fieldId) ??
      []
    : []
  const allSelected =
    !!selectable && rows.length > 0 && selected.length === rows.length

  const toggleAll = () => {
    setValue(
      fieldId,
      allSelected ? [] : rows.map((_, rowIndex) => rowIndex),
      { shouldDirty: true, shouldTouch: true },
    )
  }

  const toggleRow = (rowIndex: number) => {
    setValue(
      fieldId,
      selected.includes(rowIndex)
        ? selected.filter((index) => index !== rowIndex)
        : [...selected, rowIndex],
      { shouldDirty: true, shouldTouch: true },
    )
  }

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
              {selectable && (
                <T.HeadData>
                  <Checkbox
                    id={`${fieldId}-select-all`}
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </T.HeadData>
              )}
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
                {selectable && (
                  <T.Data>
                    <Checkbox
                      id={`${fieldId}-select-${rowIndex}`}
                      checked={selected.includes(rowIndex)}
                      onChange={() => toggleRow(rowIndex)}
                    />
                  </T.Data>
                )}
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
