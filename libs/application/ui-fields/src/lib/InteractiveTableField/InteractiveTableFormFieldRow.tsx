import { FC, memo, useEffect, useId, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Application, StaticText } from '@island.is/application/types'
import { Button, Checkbox, Table as T } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import AnimateHeight from 'react-animate-height'
import * as styles from './InteractiveTableFormField.css'
import { InteractiveTableFormFieldExpandedRow } from './InteractiveTableFormFieldExpandedRow'

export type InteractiveTableColumn = {
  truncate: boolean
  expandable?: boolean
}

interface Props {
  row: StaticText[]
  rowIndex: number
  application: Application
  selectable: boolean
  fieldId: string
  hasInputColumn: boolean
  inputFieldId?: string
  inputMaxAmount?: number
  inputPlaceholder: string
  columns: InteractiveTableColumn[]
  expandedHeader?: StaticText[]
  expandedRows?: StaticText[][]
  colSpan: number
}

const InteractiveTableFormFieldRowComponent: FC<Props> = ({
  row,
  rowIndex,
  application,
  selectable,
  fieldId,
  hasInputColumn,
  inputFieldId,
  inputMaxAmount,
  inputPlaceholder,
  columns,
  expandedHeader,
  expandedRows,
  colSpan,
}) => {
  const { formatMessage } = useLocale()
  const { control, setValue, register, unregister } = useFormContext()
  const [focused, setFocused] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [collapsing, setCollapsing] = useState(false)
  const expandedRowId = useId()

  const checkboxFieldId = `${fieldId}[${rowIndex}]`

  const isExpandable =
    !!expandedHeader && !!expandedRows && expandedRows.length > 0
  const isOpen = expanded || collapsing

  useEffect(() => {
    if (!selectable) {
      return
    }
    register(checkboxFieldId)
    return () => unregister(checkboxFieldId, { keepValue: true })
  }, [selectable, checkboxFieldId, register, unregister])

  const checked = !!useWatch({ name: checkboxFieldId, control })
  const amountFieldId =
    hasInputColumn && inputFieldId
      ? `${inputFieldId}[${rowIndex}]`
      : checkboxFieldId
  const amountValue = useWatch({ name: amountFieldId, control }) as
    | string
    | undefined

  const setInputAmount = (nowSelected: boolean) => {
    if (!hasInputColumn || !inputFieldId) {
      return
    }
    setValue(
      `${inputFieldId}[${rowIndex}]`,
      nowSelected && inputMaxAmount !== undefined
        ? inputMaxAmount.toString()
        : '',
      { shouldDirty: true, shouldTouch: true },
    )
  }

  const toggleRow = () => {
    const nowSelected = !checked
    setValue(checkboxFieldId, nowSelected, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setInputAmount(nowSelected)
  }

  const toggleExpanded = () => {
    if (expanded) {
      setCollapsing(true)
    }
    setExpanded(!expanded)
  }

  const cellBox = (position?: 'relative') => ({
    background: isOpen ? ('blue100' as const) : undefined,
    borderBottomWidth: isOpen ? undefined : ('standard' as const),
    position,
  })

  return (
    <>
      <T.Row>
        {selectable && (
          <T.Data box={cellBox('relative')}>
            {isOpen && <div className={styles.line} />}
            <Checkbox
              id={`${fieldId}-select-${rowIndex}`}
              checked={checked}
              onChange={toggleRow}
            />
          </T.Data>
        )}
        {row.map((cell, cellIndex) => {
          const value = formatText(cell, application, formatMessage)
          const { truncate, expandable } = columns[cellIndex] ?? {
            truncate: false,
          }
          const isFirstCell = !selectable && cellIndex === 0

          return (
            <T.Data
              key={`row-${rowIndex}-cell-${cellIndex}`}
              data-column-index={cellIndex}
              text={truncate ? { truncate: true } : undefined}
              title={truncate ? value : undefined}
              box={cellBox(isFirstCell ? 'relative' : undefined)}
            >
              {isFirstCell && isOpen && <div className={styles.line} />}
              {expandable && isExpandable ? (
                <Button
                  variant="text"
                  size="small"
                  icon={expanded ? 'chevronUp' : 'chevronDown'}
                  aria-expanded={expanded}
                  aria-controls={expandedRowId}
                  onClick={toggleExpanded}
                >
                  {value}
                </Button>
              ) : (
                value
              )}
            </T.Data>
          )
        })}
        {hasInputColumn && inputFieldId && (
          <T.Data
            box={cellBox()}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              if (checked && !amountValue) {
                setValue(checkboxFieldId, false, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            }}
          >
            <InputController
              id={`${inputFieldId}-${rowIndex}`}
              name={`${inputFieldId}[${rowIndex}]`}
              type="number"
              currency
              rightAlign
              allowNegative={false}
              min={1}
              max={inputMaxAmount}
              placeholder={focused ? undefined : inputPlaceholder}
              size="sm"
              disabled={!checked}
            />
          </T.Data>
        )}
      </T.Row>
      {isExpandable && (
        <tr aria-hidden={!isOpen}>
          {selectable && (
            <T.Data
              style={{ padding: 0, height: 'auto' }}
              box={{
                position: 'relative',
                background: isOpen ? 'blue100' : undefined,
                borderBottomWidth: isOpen ? 'standard' : undefined,
              }}
            >
              {isOpen && <div className={styles.line} />}
            </T.Data>
          )}
          <T.Data
            colSpan={colSpan - (selectable ? 1 : 0)}
            style={{
              padding: 0,
              paddingLeft: selectable ? 8 : 16,
              height: 'auto',
            }}
            box={{
              position: 'relative',
              background: isOpen ? 'blue100' : undefined,
              borderBottomWidth: isOpen ? 'standard' : undefined,
            }}
          >
            <AnimateHeight
              id={expandedRowId}
              duration={300}
              height={expanded ? 'auto' : 0}
              onHeightAnimationEnd={(newHeight) => {
                if (newHeight === 0) {
                  setCollapsing(false)
                }
              }}
            >
              {isOpen && (
                <>
                  {!selectable && <div className={styles.line} />}
                  <InteractiveTableFormFieldExpandedRow
                    header={expandedHeader}
                    rows={expandedRows}
                    application={application}
                  />
                </>
              )}
            </AnimateHeight>
          </T.Data>
        </tr>
      )}
    </>
  )
}

const areCellsEqual = (prev?: StaticText[], next?: StaticText[]) => {
  if (prev === next) return true
  if (!prev || !next || prev.length !== next.length) return false
  return prev.every((cell, index) => cell === next[index])
}

const areRowsEqual = (prev?: StaticText[][], next?: StaticText[][]) => {
  if (prev === next) return true
  if (!prev || !next || prev.length !== next.length) return false
  return prev.every((row, index) => areCellsEqual(row, next[index]))
}

const arePropsEqual = (prev: Props, next: Props) =>
  prev.rowIndex === next.rowIndex &&
  prev.selectable === next.selectable &&
  prev.fieldId === next.fieldId &&
  prev.hasInputColumn === next.hasInputColumn &&
  prev.inputFieldId === next.inputFieldId &&
  prev.inputMaxAmount === next.inputMaxAmount &&
  prev.inputPlaceholder === next.inputPlaceholder &&
  prev.colSpan === next.colSpan &&
  prev.row.length === next.row.length &&
  prev.row.every((cell, index) => cell === next.row[index]) &&
  prev.columns.length === next.columns.length &&
  prev.columns.every(
    (column, index) =>
      column.truncate === next.columns[index].truncate &&
      column.expandable === next.columns[index].expandable,
  ) &&
  areCellsEqual(prev.expandedHeader, next.expandedHeader) &&
  areRowsEqual(prev.expandedRows, next.expandedRows)

export const InteractiveTableFormFieldRow = memo(
  InteractiveTableFormFieldRowComponent,
  arePropsEqual,
)
