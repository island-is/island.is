import { FC, memo, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Application, StaticText } from '@island.is/application/types'
import { Button, Checkbox, Table as T } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import * as styles from './InteractiveTableFormField.css'

export type InteractiveTableColumn = {
  truncate: boolean
  onCellClick?: (rowIndex: number) => void
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
}) => {
  const { formatMessage } = useLocale()
  const { control, setValue, register, unregister } = useFormContext()
  const [focused, setFocused] = useState(false)

  const checkboxFieldId = `${fieldId}[${rowIndex}]`

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

  return (
    <T.Row>
      {selectable && (
        <T.Data>
          <Checkbox
            id={`${fieldId}-select-${rowIndex}`}
            checked={checked}
            onChange={toggleRow}
          />
        </T.Data>
      )}
      {row.map((cell, cellIndex) => {
        const value = formatText(cell, application, formatMessage)
        const { truncate, onCellClick } = columns[cellIndex] ?? {
          truncate: false,
        }

        return (
          <T.Data
            key={`row-${rowIndex}-cell-${cellIndex}`}
            data-column-index={cellIndex}
            text={truncate ? { truncate: true } : undefined}
            title={truncate ? value : undefined}
          >
            {onCellClick ? (
              <Button
                variant="text"
                size="small"
                icon="chevronDown"
                onClick={() => onCellClick(rowIndex)}
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
  )
}

const arePropsEqual = (prev: Props, next: Props) =>
  prev.rowIndex === next.rowIndex &&
  prev.selectable === next.selectable &&
  prev.fieldId === next.fieldId &&
  prev.hasInputColumn === next.hasInputColumn &&
  prev.inputFieldId === next.inputFieldId &&
  prev.inputMaxAmount === next.inputMaxAmount &&
  prev.inputPlaceholder === next.inputPlaceholder &&
  prev.row.length === next.row.length &&
  prev.row.every((cell, index) => cell === next.row[index]) &&
  prev.columns.length === next.columns.length &&
  prev.columns.every(
    (column, index) =>
      column.truncate === next.columns[index].truncate &&
      column.onCellClick === next.columns[index].onCellClick,
  )

export const InteractiveTableFormFieldRow = memo(
  InteractiveTableFormFieldRowComponent,
  arePropsEqual,
)
