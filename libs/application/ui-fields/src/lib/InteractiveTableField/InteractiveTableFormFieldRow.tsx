import {
  FC,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Application, StaticText } from '@island.is/application/types'
import {
  Button,
  Checkbox,
  HoverTooltip,
  Table as T,
} from '@island.is/island-ui/core'
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

const truncationSubscribers = new Set<() => void>()
let truncationFrame: number | null = null

const measureAllTruncations = () => {
  truncationFrame = null
  truncationSubscribers.forEach((subscriber) => subscriber())
}

const scheduleTruncationMeasure = () => {
  if (truncationFrame === null) {
    truncationFrame = requestAnimationFrame(measureAllTruncations)
  }
}

const subscribeToResize = (measure: () => void) => {
  truncationSubscribers.add(measure)

  if (truncationSubscribers.size === 1) {
    window.addEventListener('resize', scheduleTruncationMeasure)
  }

  return () => {
    truncationSubscribers.delete(measure)

    if (truncationSubscribers.size === 0) {
      window.removeEventListener('resize', scheduleTruncationMeasure)

      if (truncationFrame !== null) {
        cancelAnimationFrame(truncationFrame)
        truncationFrame = null
      }
    }
  }
}

const useTruncation = (value: string) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const measure = useCallback(() => {
    const element = ref.current

    if (!element) {
      return
    }

    setIsTruncated(element.scrollWidth > element.clientWidth)
  }, [])

  useEffect(() => {
    measure()
    return subscribeToResize(measure)
  }, [measure, value])

  return { ref, isTruncated }
}

const TruncatedCell: FC<{ value: string }> = ({ value }) => {
  const { ref, isTruncated } = useTruncation(value)

  const anchor = (
    <span ref={ref} className={styles.truncatedText}>
      {value}
    </span>
  )

  if (!isTruncated) {
    return anchor
  }

  return <HoverTooltip text={value}>{anchor}</HoverTooltip>
}

const ExpandableCell: FC<{
  value: string
  truncate: boolean
  expanded: boolean
  expandedRowId: string
  onToggle: () => void
}> = ({ value, truncate, expanded, expandedRowId, onToggle }) => {
  const { ref, isTruncated } = useTruncation(value)

  const button = (
    <Button
      variant="text"
      size="small"
      icon={expanded ? 'chevronUp' : 'chevronDown'}
      aria-expanded={expanded}
      aria-controls={expandedRowId}
      onClick={onToggle}
    >
      {truncate ? (
        <span ref={ref} className={styles.truncatedText}>
          {value}
        </span>
      ) : (
        value
      )}
    </Button>
  )

  return (
    <div className={styles.expandableCell}>
      {isTruncated ? (
        <HoverTooltip text={value}>{button}</HoverTooltip>
      ) : (
        button
      )}
    </div>
  )
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
  inputColumnLabel?: string
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
  inputColumnLabel,
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

  const rowLabel = row
    .map((cell) => formatText(cell, application, formatMessage))
    .filter(Boolean)
    .join(', ')

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
              ariaLabel={rowLabel}
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
              box={cellBox(isFirstCell ? 'relative' : undefined)}
            >
              {isFirstCell && isOpen && <div className={styles.line} />}
              {expandable && isExpandable ? (
                <ExpandableCell
                  value={value}
                  truncate={truncate}
                  expanded={expanded}
                  expandedRowId={expandedRowId}
                  onToggle={toggleExpanded}
                />
              ) : truncate ? (
                <TruncatedCell value={value} />
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
              ariaLabel={
                inputColumnLabel ? `${inputColumnLabel}: ${rowLabel}` : rowLabel
              }
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
          <T.Data
            colSpan={colSpan}
            style={{ padding: 0, paddingLeft: 16, height: 'auto' }}
            box={{
              position: 'relative',
              background: isOpen ? 'blue100' : undefined,
              borderBottomWidth: isOpen ? 'standard' : undefined,
            }}
          >
            {isOpen && <div className={styles.line} />}
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
                <InteractiveTableFormFieldExpandedRow
                  header={expandedHeader}
                  rows={expandedRows}
                  application={application}
                />
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
  prev.inputColumnLabel === next.inputColumnLabel &&
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
