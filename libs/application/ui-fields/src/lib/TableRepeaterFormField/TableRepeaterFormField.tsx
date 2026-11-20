import {
  coreMessages,
  formatText,
  formatTextWithLocale,
  resolveFieldId,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  FormText,
  TableRepeaterCellContext,
  TableRepeaterColumn,
  TableRepeaterField,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  ErrorMessage,
  GridRow,
  Icon,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { FieldDescription } from '@island.is/shared/form-fields'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { buildDefaultColumns, toTableRows } from './utils'
import {
  TableRepeaterForm,
  TableRepeaterRow,
  useTableRows,
} from './useTableRows'
import { Item } from '../RepeaterItem/RepeaterItem'
import { Locale } from '@island.is/shared/types'
import { useApolloClient } from '@apollo/client/react'
import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: TableRepeaterField
}

export const TableRepeaterFormField: FC<Props> = ({
  application,
  setBeforeSubmitCallback,
  setFieldLoadingState,
  setSubmitButtonDisabled,
  field: data,
  showFieldName,
  error,
  errors,
}) => {
  const {
    fields: rawItems,
    table,
    formTitle,
    description,
    marginTop = 6,
    marginBottom,
    getStaticTableData,
    title = '',
    titleVariant = 'h4',
    addItemButtonText = coreMessages.buttonAdd,
    cancelButtonText = coreMessages.buttonCancel,
    saveItemButtonText = coreMessages.reviewButtonSubmit,
    removeButtonTooltipText = coreMessages.deleteFieldText,
    removeButtonDisabledTooltipText,
    editButtonTooltipText = coreMessages.editFieldText,
    editButtonDisabledTooltipText,
    editField = false,
    maxRows,
    onSubmitLoad,
    loadErrorMessage,
    initActiveFieldIfEmpty,
    hideTableHeaderIfEmpty,
  } = data

  const apolloClient = useApolloClient()
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const [loadError, setLoadError] = useState<boolean>(false)

  const methods = useFormContext<TableRepeaterForm>()
  const watchedAnswers = methods.watch() ?? application.answers
  const watchedApplication = { ...application, answers: watchedAnswers }
  const resolvedId = resolveFieldId({ id: data.id }, application, user)

  const items = Object.keys(rawItems).map((key) => ({
    id: key,
    ...rawItems[key],
  }))
  const tableItems = items.filter((x) => x.displayInTable !== false)
  const columns = table?.columns ?? buildDefaultColumns(tableItems)

  const staticData = getStaticTableData?.({
    application: watchedApplication,
    locale: locale as Locale,
    formatMessage,
  })

  // Update other form values (if necessary) after saving a single row
  const updateFormAfterSavingRow = async (rows: TableRepeaterRow[]) => {
    if (!onSubmitLoad) {
      return
    }

    try {
      setLoadError(false)
      const submitResponse = await onSubmitLoad({
        apolloClient,
        application,
        tableItems: rows,
      })

      submitResponse.dictionaryOfItems.forEach((x) => {
        methods.setValue(x.path, x.value)
      })
    } catch (e) {
      console.error('e', e)
      setLoadError(true)
    }
  }

  const {
    fields,
    values,
    activeIndex,
    activeField,
    savedCount,
    isShown,
    displayIndex,
    errorMessage,
    addRow,
    saveRow,
    cancelRow,
    removeRow,
    editRow,
  } = useTableRows({
    id: resolvedId,
    initActiveFieldIfEmpty,
    getDefaultRows: () => getDefaultValue(data, application, locale),
    onSaved: updateFormAfterSavingRow,
    setBeforeSubmitCallback,
  })
  const tableRows = toTableRows(tableItems, values)

  const cellContext = (
    row: Record<string, string>,
    displayIndex: number,
  ): TableRepeaterCellContext => ({
    application: watchedApplication,
    row,
    displayIndex,
    locale: locale as Locale,
    formatMessage,
  })

  const renderCell = (
    column: TableRepeaterColumn,
    ctx: TableRepeaterCellContext,
  ) => {
    const value =
      (typeof column.value === 'string'
        ? ctx.row[column.value]
        : column.value(ctx)) ?? ''
    return typeof value === 'string'
      ? value
      : Array.isArray(value)
      ? formatText(value, application, formatMessage).join(', ')
      : formatText(value as FormText, application, formatMessage)
  }

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {showFieldName && title && (
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
        <Stack space={4}>
          {(!hideTableHeaderIfEmpty ||
            staticData?.length ||
            fields.some((_, i) => isShown(i))) && (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData></T.HeadData>
                  {columns.map((column, index) => (
                    <T.HeadData key={index}>
                      {formatText(
                        column.header ?? '',
                        application,
                        formatMessage,
                      )}
                    </T.HeadData>
                  ))}
                </T.Row>
              </T.Head>
              <T.Body>
                {staticData &&
                  staticData.map((item, index) => (
                    <T.Row key={index}>
                      <T.Data></T.Data>
                      {columns.map((column, idx) => (
                        <T.Data key={`static-${idx}`}>
                          {renderCell(column, cellContext(item, index))}
                        </T.Data>
                      ))}
                    </T.Row>
                  ))}
                {values &&
                  fields.map((field, index) => {
                    if (!isShown(index)) return null

                    const rowContext = cellContext(
                      tableRows?.[index] ?? {},
                      displayIndex(index),
                    )
                    const {
                      disabled: rowDisabled,
                      canRemove = true,
                      canEdit: rowCanEdit = true,
                    } = table?.rowProps?.(rowContext) ?? {}

                    const removeTooltipText = canRemove
                      ? removeButtonTooltipText
                      : removeButtonDisabledTooltipText

                    // aria-disabled rather than disabled so the tooltip still
                    // receives hover events on locked rows
                    const removeButton = (
                      <button
                        type="button"
                        aria-disabled={!canRemove}
                        style={canRemove ? undefined : { cursor: 'default' }}
                        onClick={canRemove ? () => removeRow(index) : undefined}
                      >
                        <Icon
                          icon="trash"
                          type="outline"
                          color={canRemove ? 'blue400' : 'dark300'}
                        />
                      </button>
                    )

                    const canEdit = !editField || rowCanEdit

                    const editTooltipText = canEdit
                      ? editButtonTooltipText
                      : editButtonDisabledTooltipText

                    const editButton = (
                      <button
                        type="button"
                        aria-disabled={!canEdit}
                        style={canEdit ? undefined : { cursor: 'default' }}
                        onClick={canEdit ? () => editRow(index) : undefined}
                        disabled={canEdit && activeIndex !== -1}
                      >
                        <Icon
                          icon="pencil"
                          color={canEdit ? 'blue400' : 'dark300'}
                          type="outline"
                          size="small"
                        />
                      </button>
                    )

                    return (
                      <T.Row key={field.id}>
                        <T.Data>
                          <Box display="flex" alignItems="center">
                            {removeTooltipText ? (
                              <Tooltip
                                placement="left"
                                text={formatText(
                                  removeTooltipText,
                                  application,
                                  formatMessage,
                                )}
                              >
                                {removeButton}
                              </Tooltip>
                            ) : (
                              removeButton
                            )}
                            &nbsp;&nbsp;
                            {editField &&
                              (editTooltipText ? (
                                <Tooltip
                                  placement="left"
                                  text={formatText(
                                    editTooltipText,
                                    application,
                                    formatMessage,
                                  )}
                                >
                                  {editButton}
                                </Tooltip>
                              ) : (
                                editButton
                              ))}
                          </Box>
                        </T.Data>
                        {columns.map((column, idx) => (
                          <T.Data key={idx} disabled={rowDisabled}>
                            {renderCell(column, rowContext)}
                          </T.Data>
                        ))}
                      </T.Row>
                    )
                  })}
              </T.Body>
            </T.Table>
          )}
          {activeField ? (
            <Stack space={2} key={activeField.id}>
              {formTitle && (
                <Text variant="h4">
                  {formatText(formTitle, application, formatMessage)}
                </Text>
              )}
              <GridRow rowGap={[2, 2, 2, 3]}>
                {items.map((item) => (
                  <Item
                    key={`${data.id}[${activeIndex}].${item.id}`}
                    application={application}
                    error={error}
                    errors={errors}
                    item={item}
                    dataId={resolvedId}
                    index={activeIndex}
                    values={values}
                    setFieldLoadingState={setFieldLoadingState}
                    setSubmitButtonDisabled={setSubmitButtonDisabled}
                    compactLayout
                  />
                ))}
              </GridRow>
              <Box display="flex" alignItems="center" justifyContent="flexEnd">
                <Box>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => cancelRow(activeIndex)}
                  >
                    {formatText(cancelButtonText, application, formatMessage)}
                  </Button>
                </Box>
                <Box marginLeft={2}>
                  <Button type="button" onClick={() => saveRow(activeIndex)}>
                    {formatText(saveItemButtonText, application, formatMessage)}
                  </Button>
                </Box>
              </Box>
            </Stack>
          ) : (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                variant="ghost"
                type="button"
                onClick={addRow}
                icon="add"
                disabled={maxRows ? savedCount >= maxRows : false}
              >
                {formatText(addItemButtonText, application, formatMessage)}
              </Button>
            </Box>
          )}
        </Stack>
        {error && typeof error === 'string' && (
          <Box marginTop={3}>
            <AlertMessage type="error" title={error} />
          </Box>
        )}
        {loadError && loadErrorMessage && (
          <Box marginTop={3}>
            <AlertMessage
              type="error"
              title={formatText(loadErrorMessage, application, formatMessage)}
            />
          </Box>
        )}
        {errorMessage && (
          <ErrorMessage id={`${data.id}-error`}>{errorMessage}</ErrorMessage>
        )}
      </Box>
    </Box>
  )
}
