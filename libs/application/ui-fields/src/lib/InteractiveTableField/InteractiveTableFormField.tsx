import {
  FieldBaseProps,
  InteractiveTableField,
} from '@island.is/application/types'
import { FC, ReactNode, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Box, Checkbox, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatText,
  formatTextWithLocale,
  resolveFieldId,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'
import * as styles from './InteractiveTableFormField.css'
import { InteractiveTableFormFieldRow } from './InteractiveTableFormFieldRow'

interface Props extends FieldBaseProps {
  field: InteractiveTableField
}

export const InteractiveTableFormField: FC<Props> = ({
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
  const { control, setValue } = useFormContext()
  const fieldId = resolveFieldId({ id: field.id }, application, user)

  const header =
    typeof field.header === 'function'
      ? field.header(application)
      : field.header
  const rows = useMemo(
    () =>
      typeof field.rows === 'function' ? field.rows(application) : field.rows,
    [field.rows, application],
  )
  const footerRow = useMemo(
    () =>
      typeof field.footerRow === 'function'
        ? field.footerRow(application)
        : field.footerRow,
    [field.footerRow, application],
  )

  const hasInputColumn = !!field.inputColumn
  const inputFieldId = field.inputColumn
    ? resolveFieldId({ id: field.inputColumn.id }, application, user)
    : undefined
  const inputMaxAmounts = useMemo(
    () => field.inputColumn?.getMaxAmount?.(application) ?? [],
    [field.inputColumn, application],
  )
  const inputPlaceholder = field.inputColumn?.placeholder
    ? formatText(field.inputColumn.placeholder, application, formatMessage)
    : 'kr.'

  const fillerCell = (key: string) => <T.Data key={key} />

  const leadingColumn = (content: ReactNode) => (selectable ? content : null)
  const trailingColumn = (content: ReactNode) =>
    hasInputColumn ? content : null

  const selectedValues = (useWatch({ name: fieldId, control }) ?? []) as (
    | boolean
    | undefined
  )[]
  const allSelected =
    !!selectable &&
    rows.length > 0 &&
    rows.every((_, rowIndex) => !!selectedValues[rowIndex])

  const toggleAll = () => {
    const nowSelected = !allSelected
    rows.forEach((_, rowIndex) => {
      setValue(`${fieldId}[${rowIndex}]`, nowSelected, {
        shouldDirty: true,
        shouldTouch: true,
      })
      if (hasInputColumn && inputFieldId) {
        const maxAmount = inputMaxAmounts[rowIndex]
        setValue(
          `${inputFieldId}[${rowIndex}]`,
          nowSelected && maxAmount !== undefined ? maxAmount.toString() : '',
          { shouldDirty: true, shouldTouch: true },
        )
      }
    })
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
      <Box
        marginTop={description ? 3 : 0}
        dataTestId={field.dataTestId}
        className={
          hasInputColumn || footerRow ? styles.tableWrapper : undefined
        }
      >
        <T.Table>
          <T.Head>
            <T.Row>
              {leadingColumn(
                <T.HeadData
                  style={
                    hasInputColumn ? styles.checkboxColumnStyle : undefined
                  }
                >
                  <Checkbox
                    id={`${fieldId}-select-all`}
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </T.HeadData>,
              )}
              {header.map((headerCell, index) => {
                const hasWidth =
                  typeof headerCell === 'object' &&
                  headerCell !== null &&
                  'label' in headerCell
                const label = hasWidth ? headerCell.label : headerCell
                const width = hasWidth ? headerCell.width : undefined

                return (
                  <T.HeadData
                    key={`${label}-${index}`}
                    style={
                      width
                        ? { width }
                        : hasInputColumn && index === header.length - 1
                        ? styles.inputColumnHeaderStyle
                        : undefined
                    }
                  >
                    {formatText(label, application, formatMessage)}
                  </T.HeadData>
                )
              })}
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((row, rowIndex) => (
              <InteractiveTableFormFieldRow
                key={`row-${rowIndex}`}
                row={row}
                rowIndex={rowIndex}
                application={application}
                selectable={!!selectable}
                fieldId={fieldId}
                hasInputColumn={hasInputColumn}
                inputFieldId={inputFieldId}
                inputMaxAmount={inputMaxAmounts[rowIndex]}
                inputPlaceholder={inputPlaceholder}
              />
            ))}
            {footerRow && (
              <T.Row dataTestId={styles.footerRowTestId}>
                {leadingColumn(fillerCell('footer-checkbox-column'))}
                {footerRow.map((cell, cellIndex) => (
                  <T.Data
                    key={`footer-cell-${cellIndex}`}
                    text={
                      cellIndex === footerRow.length - 1
                        ? { fontWeight: 'semiBold' }
                        : undefined
                    }
                  >
                    {formatText(cell, application, formatMessage)}
                  </T.Data>
                ))}
                {trailingColumn(fillerCell('footer-input-column'))}
              </T.Row>
            )}
          </T.Body>
        </T.Table>
      </Box>
    </Box>
  )
}
