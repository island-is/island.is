import {
  QuestionnaireAnswerOptionType,
  QuestionnaireTableColumn,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridRow,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import React, { useState } from 'react'
import { m } from '../../../lib/messages'
import { QuestionAnswer } from '../../../types/questionnaire'
import { TextInput } from './TextInput'

interface TableProps {
  id: string
  columns: QuestionnaireTableColumn[]
  value?: QuestionAnswer
  onChange: (answer: QuestionAnswer) => void
  disabled?: boolean
  error?: string
  numRows?: number
  maxRows?: number
}

interface TableRowData {
  [columnId: string]: string
}

export const Table: React.FC<TableProps> = ({
  id,
  columns,
  value,
  onChange,
  disabled = false,
  error,
  maxRows = 10,
}) => {
  useNamespaces('service.portal')
  const { formatMessage } = useLocale()
  // Parse existing answers into row format
  const parseExistingAnswers = (): TableRowData[] => {
    if (!value?.answers || value.answers.length === 0) {
      return []
    }

    const rows: TableRowData[] = []
    const answersByColumn: { [columnId: string]: string[] } = {}

    // First, group all answers by column
    value.answers.forEach((answer) => {
      if (!answer.value) return

      // Check if this is a column ID we know about
      const column = columns.find((col) =>
        answer.value.startsWith(`${col.id}:`),
      )
      if (column) {
        //Format: columnId:type:value
        const parts = answer.value.split(':')
        let rowValue = ''

        if (parts.length >= 3) {
          rowValue = parts.slice(2).join(':')
        }

        if (!answersByColumn[column.id]) {
          answersByColumn[column.id] = []
        }
        answersByColumn[column.id].push(rowValue ?? '')
      }
    })

    const actualRowCount = Math.max(
      ...Object.values(answersByColumn).map((arr) => arr.length),
      0,
    )
    const maxRowCount = Math.min(actualRowCount, maxRows)
    // Build rows
    for (let i = 0; i < maxRowCount; i++) {
      const row: TableRowData = {}
      columns.forEach((col) => {
        row[col.id] = answersByColumn[col.id]?.[i] ?? ''
      })
      rows.push(row)
    }

    return rows
  }

  const [rows, setRows] = useState<TableRowData[]>(parseExistingAnswers)
  const [currentRow, setCurrentRow] = useState<TableRowData>({})
  const [showForm, setShowForm] = useState(false)

  const updateAnswers = (newRows: TableRowData[]) => {
    // Convert rows to answer format: "columnId:columnType:value" for each cell
    const answers: Array<{ value: string; label?: string }> = []

    newRows.forEach((row) => {
      columns.forEach((col) => {
        const cellValue = row[col.id] ?? ''
        if (cellValue) {
          answers.push({
            value: `${col.id}:${col.type}:${cellValue}`,
            label: col.label,
          })
        }
      })
    })

    onChange({
      questionId: id,
      question: '', // Question label is not needed here
      answers,
      type: QuestionnaireAnswerOptionType.table,
    })
  }

  const handleAddRow = () => {
    if (rows.length < maxRows) {
      // Check if current row has any values
      const hasValues = columns.some((col) => currentRow[col.id]?.trim())

      if (hasValues) {
        const newRows = [...rows, currentRow]
        setRows(newRows)
        setCurrentRow({}) // Clear the form
        setShowForm(false) // Hide the form after adding
        updateAnswers(newRows)
      }
    }
  }

  const handleCancelAdd = () => {
    setCurrentRow({})
    setShowForm(false)
  }

  const handleRemoveRow = (rowIndex: number) => {
    const newRows = rows.filter((_, index) => index !== rowIndex)
    setRows(newRows)
    updateAnswers(newRows)
  }

  const handleCurrentRowChange = (columnId: string, value: string) => {
    setCurrentRow({
      ...currentRow,
      [columnId]: value,
    })
  }

  const renderFormInput = (column: QuestionnaireTableColumn) => {
    const cellValue = currentRow[column.id] ?? ''

    switch (column.type) {
      case 'string':
        return (
          <TextInput
            id={`${id}_${column.id}_new`}
            label={column.label}
            backgroundColor="white"
            value={cellValue}
            onChange={(value) => handleCurrentRowChange(column.id, value)}
            disabled={disabled || rows.length >= maxRows}
            multiline={column.multiline ?? false}
            maxLength={column.maxLength ?? undefined}
          />
        )

      case 'number':
        return (
          <TextInput
            id={`${id}_${column.id}_new`}
            label={column.label}
            value={cellValue}
            onChange={(value) => handleCurrentRowChange(column.id, value)}
            disabled={disabled || rows.length >= maxRows}
            type="number"
            backgroundColor="white"
          />
        )

      case 'date':
        return (
          <DatePicker
            locale="is"
            id={`${id}_${column.id}_new`}
            label={column.label}
            placeholderText={formatMessage(m.chooseDate)}
            selected={cellValue ? new Date(cellValue) : undefined}
            handleChange={(date: Date) =>
              handleCurrentRowChange(
                column.id,
                date ? date.toISOString().split('T')[0] : '',
              )
            }
            backgroundColor="white"
            disabled={disabled || rows.length >= maxRows}
            size="xs"
          />
        )

      default:
        return (
          <TextInput
            id={`${id}_${column.id}_new`}
            label={column.label}
            value={cellValue}
            onChange={(value) => handleCurrentRowChange(column.id, value)}
            disabled={disabled || rows.length >= maxRows}
            backgroundColor="white"
          />
        )
    }
  }

  const formatCellValue = (value: string, columnType: string): string => {
    if (!value) return '-'

    if (columnType === 'date') {
      try {
        const date = new Date(value)
        return date.toLocaleDateString('is-IS')
      } catch {
        return value
      }
    }

    return value
  }

  return (
    <Box>
      {error && (
        <Text
          variant="small"
          color="red600"
          marginBottom={2}
          id={`${id}-error`}
        >
          {error}
        </Text>
      )}

      {/* Always show table with headers */}
      <Box marginBottom={4}>
        <T.Table>
          <T.Head>
            <T.Row>
              {columns.map((column) => (
                <T.HeadData key={column.id}>
                  {column.label}
                  {column.required && <span style={{ color: 'red' }}> *</span>}
                </T.HeadData>
              ))}
              <T.HeadData align="right">{formatMessage(m.actions)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.length === 0 ? (
              <T.Row>
                <T.Data colSpan={columns.length + 1}>
                  <Box paddingY={3} display="flex" justifyContent="center">
                    <Text variant="small" color="dark300">
                      {formatMessage(m.noData)}
                    </Text>
                  </Box>
                </T.Data>
              </T.Row>
            ) : (
              rows.map((row, rowIndex) => (
                <T.Row key={rowIndex}>
                  {columns.map((column) => (
                    <T.Data key={column.id}>
                      {formatCellValue(row[column.id], column.type)}
                    </T.Data>
                  ))}
                  <T.Data align="right">
                    <Box
                      display="flex"
                      alignItems="flexEnd"
                      justifyContent="flexEnd"
                    >
                      <Button
                        variant="text"
                        size="small"
                        icon="trash"
                        iconType="outline"
                        onClick={() => handleRemoveRow(rowIndex)}
                        disabled={disabled}
                        aria-label={`${formatMessage(m.deleteRow)} ${
                          rowIndex + 1
                        }`}
                      >
                        {formatMessage(m.deleteRow)}
                      </Button>
                    </Box>
                  </T.Data>
                </T.Row>
              ))
            )}
          </T.Body>
        </T.Table>

        <Box marginTop={2}>
          <Text variant="small" color="dark300">
            {formatMessage(m.rowOf, {
              count: rows.length,
              total: maxRows,
            })}
          </Text>
        </Box>
      </Box>

      {/* Form for adding new row - only shown when showForm is true */}
      {showForm && rows.length < maxRows && (
        <Box
          padding={4}
          background="blue100"
          borderRadius="large"
          marginBottom={2}
        >
          <Text variant="h5" marginBottom={3}>
            {formatMessage(m.addRow)}
          </Text>

          <GridRow>
            {columns.map((column) => (
              <GridColumn
                key={column.id}
                span={
                  columns.length === 1
                    ? '12/12'
                    : columns.length === 2
                    ? ['12/12', '12/12', '12/12', '6/12']
                    : columns.length === 3
                    ? ['12/12', '12/12', '12/12', '4/12']
                    : '12/12'
                }
              >
                {renderFormInput(column)}
              </GridColumn>
            ))}
          </GridRow>

          <Box marginTop={3} display="flex" columnGap={2}>
            <Button
              variant="primary"
              size="small"
              icon="add"
              iconType="outline"
              onClick={handleAddRow}
              disabled={
                disabled ||
                rows.length >= maxRows ||
                !columns.some((col) => currentRow[col.id]?.trim())
              }
            >
              {formatMessage(m.add)}
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleCancelAdd}
              disabled={disabled}
            >
              {formatMessage(m.buttonCancel)}
            </Button>
          </Box>
        </Box>
      )}

      {/* Show "Add" button when form is not visible */}
      {!showForm && rows.length < maxRows && (
        <Box marginTop={3}>
          <Button
            variant="ghost"
            size="small"
            icon="add"
            iconType="outline"
            onClick={() => setShowForm(true)}
            disabled={disabled}
          >
            {formatMessage(m.addRow)}
          </Button>
        </Box>
      )}

      {rows.length >= maxRows && (
        <Box marginTop={2}>
          <Text variant="small" color="red600">
            {formatMessage(m.maxRowsReached, { count: maxRows })}
          </Text>
        </Box>
      )}
    </Box>
  )
}
