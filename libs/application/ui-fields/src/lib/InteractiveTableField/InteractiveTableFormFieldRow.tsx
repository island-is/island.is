import {
  FC,
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  Application,
  InteractiveTableHeaderCell,
  StaticText,
} from '@island.is/application/types'
import {
  Box,
  Button,
  Checkbox,
  HoverTooltip,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import AnimateHeight from 'react-animate-height'
import * as styles from './InteractiveTableFormField.css'
import {
  hasExpandedTable,
  InteractiveTableFormFieldExpandedRow,
} from './InteractiveTableFormFieldExpandedRow'

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
  inline?: boolean
}> = ({ value, truncate, expanded, expandedRowId, onToggle, inline }) => {
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

  if (inline) {
    return button
  }

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
  labels: string[]
  expandedHeader?: InteractiveTableHeaderCell[]
  expandedRows?: StaticText[][]
  expandedInfo?: StaticText
  colSpan: number
  mobile: boolean
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
  labels,
  expandedHeader,
  expandedRows,
  expandedInfo,
  colSpan,
  mobile,
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
    hasExpandedTable({ header: expandedHeader, rows: expandedRows }) ||
    !!expandedInfo
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

  const checkbox = (
    <Checkbox
      id={`${fieldId}-select-${rowIndex}`}
      ariaLabel={rowLabel}
      checked={checked}
      onChange={toggleRow}
    />
  )

  const inputHandlers = {
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false)
      if (checked && !amountValue) {
        setValue(checkboxFieldId, false, {
          shouldDirty: true,
          shouldTouch: true,
        })
      }
    },
  }

  const input = hasInputColumn && inputFieldId && (
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
  )

  const expandedContent = (
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
        <Box
          marginTop={mobile ? 1 : 0}
          paddingTop={mobile ? 2 : 0}
          borderTopWidth={mobile ? 'standard' : undefined}
          borderColor="blue200"
        >
          <InteractiveTableFormFieldExpandedRow
            header={expandedHeader}
            rows={expandedRows}
            info={expandedInfo}
            application={application}
            mobile={mobile}
          />
        </Box>
      )}
    </AnimateHeight>
  )

  if (mobile) {
    const titleIndex = Math.max(
      columns.findIndex((column) => column.expandable),
      0,
    )
    const title = formatText(row[titleIndex], application, formatMessage)
    const pair = (key: string, label: string | undefined, value: ReactNode) => (
      <Fragment key={key}>
        <dt>
          <Text as="span" variant="medium" fontWeight="semiBold">
            {label}
          </Text>
        </dt>
        {value}
      </Fragment>
    )

    return (
      <Box
        component="li"
        paddingX={2}
        paddingY={2}
        borderBottomWidth="standard"
        borderColor="blue200"
        background={isOpen ? 'blue100' : undefined}
      >
        <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
          {isExpandable && columns[titleIndex]?.expandable ? (
            <ExpandableCell
              value={title}
              truncate={false}
              expanded={expanded}
              expandedRowId={expandedRowId}
              onToggle={toggleExpanded}
              inline
            />
          ) : (
            <Text variant="medium" fontWeight="semiBold">
              {title}
            </Text>
          )}
          {selectable && checkbox}
        </Box>
        <Box component="dl" className={styles.pairs} marginTop={1}>
          {row.map((cell, cellIndex) =>
            cellIndex === titleIndex
              ? null
              : pair(
                  `row-${rowIndex}-cell-${cellIndex}`,
                  labels[cellIndex],
                  <dd>
                    <Text as="span" variant="medium">
                      {formatText(cell, application, formatMessage)}
                    </Text>
                  </dd>,
                ),
          )}
          {input &&
            pair(
              `row-${rowIndex}-input`,
              inputColumnLabel,
              <dd {...inputHandlers}>{input}</dd>,
            )}
        </Box>
        {isExpandable && expandedContent}
      </Box>
    )
  }

  return (
    <>
      <T.Row>
        {selectable && (
          <T.Data box={cellBox('relative')}>
            {isOpen && <div className={styles.line} />}
            {checkbox}
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
        {input && (
          <T.Data box={cellBox()} {...inputHandlers}>
            {input}
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
            {expandedContent}
          </T.Data>
        </tr>
      )}
    </>
  )
}

const areCellsEqual = <T,>(prev?: T[], next?: T[]) => {
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
  prev.mobile === next.mobile &&
  areCellsEqual(prev.labels, next.labels) &&
  prev.row.length === next.row.length &&
  prev.row.every((cell, index) => cell === next.row[index]) &&
  prev.columns.length === next.columns.length &&
  prev.columns.every(
    (column, index) =>
      column.truncate === next.columns[index].truncate &&
      column.expandable === next.columns[index].expandable,
  ) &&
  prev.expandedInfo === next.expandedInfo &&
  areCellsEqual(prev.expandedHeader, next.expandedHeader) &&
  areRowsEqual(prev.expandedRows, next.expandedRows)

export const InteractiveTableFormFieldRow = memo(
  InteractiveTableFormFieldRowComponent,
  arePropsEqual,
)
