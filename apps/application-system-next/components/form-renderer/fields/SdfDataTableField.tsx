import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  InputError,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import type {
  SdfDataTableEditableRow,
  SdfDataTableRow,
} from '../../../lib/graphql'
import type { FieldRendererProps } from '../types'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import { getObjectAnswer, isRecord } from '../utils'

const getDataTableUnits = (
  value: Record<string, unknown>,
): Record<string, unknown>[] =>
  Array.isArray(value.units)
    ? value.units.filter((unit): unit is Record<string, unknown> =>
        isRecord(unit),
      )
    : []

const getDataTableUnitKey = (unit: Record<string, unknown>): string => {
  const propertyCode = unit.propertyCode
  const unitCode = unit.unitCode
  if (propertyCode !== undefined && unitCode !== undefined) {
    return `${propertyCode}_${unitCode}`
  }
  const id = unit.id ?? unit.rowId
  return id !== undefined ? String(id) : ''
}

const parseDataTableInputValue = (
  value: string,
  type: string,
): string | number => {
  if (type !== 'number') {
    return value
  }
  if (value.trim() === '') {
    return 0
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
}

const headerCellStyle: React.CSSProperties = {
  background: '#f2f7ff',
  padding: '24px 16px',
  fontSize: 14,
  fontWeight: 700,
  textAlign: 'left',
  lineHeight: 1.25,
}

const parentCellStyle: React.CSSProperties = {
  padding: '24px 16px',
  borderBottom: '1px solid #e6ecf7',
  textAlign: 'left',
  verticalAlign: 'middle',
}

const childCellStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid #e6ecf7',
  background: '#f2f7ff',
  textAlign: 'left',
  verticalAlign: 'middle',
}

const numericCellStyle: React.CSSProperties = {
  ...childCellStyle,
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  padding: '10px',
  fontSize: 14,
  textAlign: 'right',
  border: '1px solid #CCDFFF',
  borderRadius: 8,
  background: '#fff',
  boxSizing: 'border-box',
}

const toggleButtonStyle = (expanded: boolean): React.CSSProperties => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: 0,
  background: expanded ? '#00e4ca' : '#fff',
  color: '#00103f',
  cursor: 'pointer',
  lineHeight: '24px',
  padding: 0,
  fontWeight: 700,
})

export const SdfDataTableField = ({
  component,
  currentValue,
  error,
  handleChange,
  isRefetchPending,
}: FieldRendererProps) => {
  const [expandedDataTableRows, setExpandedDataTableRows] = useState<
    Record<string, boolean>
  >({})
  const tableValue = getObjectAnswer(currentValue)
  const selectedUnits = getDataTableUnits(tableValue)
  const dataRows = (component.rows ?? []) as SdfDataTableRow[]

  const getSelectedUnit = (rowId: string) =>
    selectedUnits.find((unit) => getDataTableUnitKey(unit) === rowId)

  const setSelectedUnits = (nextUnits: Record<string, unknown>[]) => {
    handleChange({
      ...tableValue,
      units: nextUnits,
    })
  }

  const updateSelectedUnit = (
    rowId: string,
    patch: Record<string, unknown>,
  ) => {
    setSelectedUnits(
      selectedUnits.map((unit) =>
        getDataTableUnitKey(unit) === rowId ? { ...unit, ...patch } : unit,
      ),
    )
  }

  const toggleEditableRow = (
    editableRow: SdfDataTableEditableRow,
    checked: boolean,
  ) => {
    const rowId = editableRow.id
    if (!checked) {
      setSelectedUnits(
        selectedUnits.filter((unit) => getDataTableUnitKey(unit) !== rowId),
      )
      return
    }

    const defaults = editableRow.defaultValues ?? {}
    const inputDefaults = Object.fromEntries(
      editableRow.inputs.map((input) => [
        input.key,
        defaults[input.key] ?? (input.type === 'number' ? 0 : ''),
      ]),
    )
    const nextUnit = {
      ...(editableRow.payload ?? { id: rowId }),
      ...inputDefaults,
      checked: true,
    }

    setSelectedUnits([
      ...selectedUnits.filter((unit) => getDataTableUnitKey(unit) !== rowId),
      nextUnit,
    ])
  }

  return (
    <Box {...getSdfFieldMargins(component)}>
      {component.label && (
        <Text variant="h3" marginBottom={2}>
          {component.label}
        </Text>
      )}
      {isRefetchPending ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingY={5}
        >
          <LoadingDots />
        </Box>
      ) : dataRows.length === 0 ? null : (
        <Box marginTop={6} overflow="auto">
          <table style={tableStyle}>
            <colgroup>
              <col style={{ width: 56 }} />
              <col style={{ width: '50%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 88 }} />
            </colgroup>
            {component.header && component.header.length > 0 ? (
              <thead>
                <tr>
                  <th style={{ ...headerCellStyle, width: 56 }} />
                  {component.header.map((h: string, i: number) => (
                    <th
                      key={i}
                      style={{
                        ...headerCellStyle,
                        textAlign: i >= 2 ? 'right' : 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {dataRows.map((row) => {
                const expanded = expandedDataTableRows[row.id] === true
                const childRows = row.expandable?.rows ?? []

                return (
                  <React.Fragment key={row.id}>
                    <tr>
                      <td style={{ ...parentCellStyle, textAlign: 'center' }}>
                        {childRows.length > 0 && (
                          <button
                            type="button"
                            style={toggleButtonStyle(expanded)}
                            onClick={() =>
                              setExpandedDataTableRows((current) => ({
                                ...current,
                                [row.id]: !expanded,
                              }))
                            }
                            aria-label={
                              expanded
                                ? `Collapse ${row.id}`
                                : `Expand ${row.id}`
                            }
                          >
                            {expanded ? '-' : '+'}
                          </button>
                        )}
                      </td>
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={
                            cellIndex >= 2
                              ? { ...parentCellStyle, textAlign: 'right' }
                              : parentCellStyle
                          }
                        >
                          <Text fontWeight="regular" variant="medium">
                            {cell}
                          </Text>
                        </td>
                      ))}
                    </tr>
                    {expanded &&
                      childRows.map((editableRow) => {
                        const selectedUnit = getSelectedUnit(editableRow.id)
                        const checked = selectedUnit !== undefined
                        return (
                          <tr key={editableRow.id}>
                            <td style={childCellStyle} />
                            <td style={childCellStyle}>
                              {editableRow.hasCheckbox ? (
                                <Checkbox
                                  id={`${component.id}-${editableRow.id}-checked`}
                                  name={`${component.id}-${editableRow.id}-checked`}
                                  label={editableRow.label}
                                  checked={checked}
                                  onChange={(event) =>
                                    toggleEditableRow(
                                      editableRow,
                                      event.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <Text variant="medium">
                                  {editableRow.label}
                                </Text>
                              )}
                            </td>
                            <td style={childCellStyle}>
                              <Text variant="medium">
                                {editableRow.cells[0] ?? ''}
                              </Text>
                            </td>
                            {editableRow.inputs.map((input) => {
                              const value =
                                selectedUnit?.[input.key] ??
                                editableRow.defaultValues?.[input.key] ??
                                ''
                              return (
                                <td key={input.key} style={numericCellStyle}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-end',
                                      gap: 4,
                                    }}
                                  >
                                    <input
                                      name={`${component.id}-${editableRow.id}-${input.key}`}
                                      type="text"
                                      min={input.min}
                                      max={input.max}
                                      step={
                                        input.type === 'number'
                                          ? 'any'
                                          : undefined
                                      }
                                      disabled={!checked}
                                      style={{
                                        ...inputStyle,
                                        flex: input.suffix
                                          ? '1 1 auto'
                                          : undefined,
                                        opacity: checked ? 1 : 0.7,
                                      }}
                                      value={String(value)}
                                      onChange={(event) =>
                                        updateSelectedUnit(editableRow.id, {
                                          [input.key]: parseDataTableInputValue(
                                            event.target.value,
                                            input.type,
                                          ),
                                        })
                                      }
                                    />
                                    {input.suffix ? (
                                      <span
                                        style={{ fontSize: 14, flexShrink: 0 }}
                                      >
                                        {input.suffix}
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </Box>
      )}
      {error && (
        <Box marginTop={1}>
          <InputError errorMessage={error} />
        </Box>
      )}
    </Box>
  )
}
