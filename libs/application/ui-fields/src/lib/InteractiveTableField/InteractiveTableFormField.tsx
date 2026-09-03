import {
  FieldBaseProps,
  InteractiveTableField,
  InteractiveTableHeaderCell,
  StaticText,
} from '@island.is/application/types'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'
import {
  Box,
  Checkbox,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatText,
  formatTextWithLocale,
  resolveFieldId,
} from '@island.is/application/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'
import * as styles from './InteractiveTableFormField.css'
import {
  InteractiveTableColumn,
  InteractiveTableFormFieldRow,
} from './InteractiveTableFormFieldRow'

interface Props extends FieldBaseProps {
  field: InteractiveTableField
}

const isHeaderColumnConfig = (
  headerCell: InteractiveTableHeaderCell,
): headerCell is Exclude<InteractiveTableHeaderCell, StaticText> =>
  typeof headerCell === 'object' && headerCell !== null && 'label' in headerCell

export const InteractiveTableFormField: FC<Props> = ({
  field,
  application,
  showFieldName,
  setSubmitButtonDisabled,
}) => {
  const {
    marginTop,
    marginBottom,
    description,
    title = '',
    titleVariant,
    selectable,
    pageSize,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const { control, setValue, getValues } = useFormContext()
  const fieldId = resolveFieldId({ id: field.id }, application, user)

  const header =
    typeof field.header === 'function'
      ? field.header(application)
      : field.header
  const columns = header.map<InteractiveTableColumn>((headerCell) =>
    isHeaderColumnConfig(headerCell)
      ? {
          truncate: !!headerCell.truncate,
          expandable: !!headerCell.expandable,
        }
      : { truncate: false },
  )
  const rows = useMemo(
    () =>
      typeof field.rows === 'function' ? field.rows(application) : field.rows,
    [field.rows, application],
  )
  const [page, setPage] = useState(1)
  const isPaginated = !!pageSize && rows.length > pageSize
  const totalPages = pageSize
    ? Math.max(1, Math.ceil(rows.length / pageSize))
    : 1
  const firstRowOnPage = pageSize ? (page - 1) * pageSize : 0
  const rowsOnPage = useMemo(
    () =>
      pageSize ? rows.slice(firstRowOnPage, firstRowOnPage + pageSize) : rows,
    [rows, pageSize, firstRowOnPage],
  )

  useEffect(() => {
    if (page <= totalPages) return
    setPage(totalPages)
  }, [page, totalPages])

  const footerRow = useMemo(
    () =>
      typeof field.footerRow === 'function'
        ? field.footerRow(application)
        : field.footerRow,
    [field.footerRow, application],
  )

  const expandedHeader = useMemo(() => {
    const config = field.expandedRows?.header
    return typeof config === 'function' ? config(application) : config
  }, [field.expandedRows, application])
  const expandedRows = useMemo(() => {
    const config = field.expandedRows?.rows
    return typeof config === 'function' ? config(application) : config
  }, [field.expandedRows, application])

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

  const colSpan = header.length + (selectable ? 1 : 0)

  const fillerCell = (key: string) => <T.Data key={key} />

  const leadingColumn = (content: ReactNode) => (selectable ? content : null)
  const trailingColumn = (content: ReactNode) =>
    hasInputColumn ? content : null

  const watchedSelectedValues = useWatch({ name: fieldId, control })
  const watchedInputValues = useWatch({
    name: inputFieldId ?? fieldId,
    control,
  })
  const selectedValues = useMemo(
    () => (watchedSelectedValues ?? []) as (boolean | null | undefined)[],
    [watchedSelectedValues],
  )
  const inputValues = useMemo(
    () => (watchedInputValues ?? []) as (string | null | undefined)[],
    [watchedInputValues],
  )
  const allSelected = useMemo(
    () =>
      !!selectable &&
      rows.length > 0 &&
      rows.every((_, rowIndex) => !!selectedValues[rowIndex]),
    [selectable, rows, selectedValues],
  )

  const { isSubmitDisabled } = field
  const submitDisabled =
    isSubmitDisabled?.({
      selectedRows: rows.map((_, rowIndex) => !!selectedValues[rowIndex]),
      inputValues: hasInputColumn
        ? rows.map((_, rowIndex) => inputValues[rowIndex] ?? '')
        : [],
      application,
    }) ?? false

  useEffect(() => {
    if (!isSubmitDisabled) return
    setSubmitButtonDisabled?.(submitDisabled)
  }, [isSubmitDisabled, submitDisabled, setSubmitButtonDisabled])

  useEffect(() => {
    if (!selectable) return
    const currentSelected = (getValues(fieldId) ?? []) as (
      | boolean
      | null
      | undefined
    )[]
    const currentInputs = (
      inputFieldId ? getValues(inputFieldId) ?? [] : []
    ) as (string | null | undefined)[]

    rows.forEach((_, rowIndex) => {
      const selected = currentSelected[rowIndex]
      if (selected === undefined || selected === null) {
        setValue(`${fieldId}[${rowIndex}]`, false)
      }
      const inputValue = currentInputs[rowIndex]
      if (inputFieldId && (inputValue === undefined || inputValue === null)) {
        setValue(`${inputFieldId}[${rowIndex}]`, '')
      }
    })
  }, [selectable, rows, fieldId, inputFieldId, getValues, setValue])

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
        className={styles.tableWrapper}
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
                const isColumnConfig = isHeaderColumnConfig(headerCell)
                const label = isColumnConfig ? headerCell.label : headerCell
                const width = isColumnConfig ? headerCell.width : undefined

                return (
                  <T.HeadData
                    key={`${label}-${index}`}
                    data-column-index={index}
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
            {rowsOnPage.map((row, indexOnPage) => {
              const rowIndex = firstRowOnPage + indexOnPage

              return (
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
                  columns={columns}
                  expandedHeader={expandedHeader}
                  expandedRows={expandedRows?.[rowIndex]}
                  colSpan={colSpan}
                />
              )
            })}
            {footerRow && (
              <T.Row dataTestId={styles.footerRowTestId}>
                {leadingColumn(fillerCell('footer-checkbox-column'))}
                {footerRow.map((cell, cellIndex) => (
                  <T.Data
                    key={`footer-cell-${cellIndex}`}
                    data-column-index={cellIndex}
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
      {isPaginated && (
        <Box marginTop={3}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(nextPage, className, children) => (
              <Box
                component="button"
                type="button"
                cursor="pointer"
                className={className}
                onClick={() => setPage(nextPage)}
              >
                {children}
              </Box>
            )}
          />
        </Box>
      )}
    </Box>
  )
}
