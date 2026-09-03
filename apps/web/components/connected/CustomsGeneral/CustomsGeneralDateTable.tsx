import { useId } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  DatePicker,
  Inline,
  LoadingDots,
  Stack,
  Tag,
} from '@island.is/island-ui/core'
import { SortableTable, SortableTableColumn } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'

import { NotYetInEffectTag, ValidityFields } from './customsGeneralUtils'
import { m } from './translation.strings'

interface Props<T extends Record<string, any> & ValidityFields> {
  columns: SortableTableColumn<T>[]
  data: T[]
  loading: boolean
  error?: Error
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  dateLabel: string
  errorTitle: string
  id?: string
  system?: 'I' | 'U'
  onSystemChange?: (system: 'I' | 'U') => void
  onRowClick?: (row: T) => void
}

/**
 * The reference date is a calendar day, so it is built from the local date parts the user
 * picked rather than from `toISOString`, which would shift the day for anyone not on UTC.
 */
export const toApiDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T00:00:00Z`
}

export const CustomsGeneralDateTable = <
  T extends Record<string, any> & ValidityFields,
>({
  columns,
  data,
  loading,
  error,
  selectedDate,
  onDateChange,
  dateLabel,
  errorTitle,
  id: idProp,
  system,
  onSystemChange,
  onRowClick,
}: Props<T>) => {
  const { activeLocale } = useI18n()
  const { formatMessage } = useIntl()
  const generatedId = useId()
  const id = idProp ?? generatedId

  /**
   * Rows the upstream API published ahead of time are shown alongside the ones already
   * in effect, labelled with the date they take effect on. The label goes on the first
   * column holding a value of its own, so it sits next to what identifies the row.
   */
  const labelledColumnKey = columns.find(
    (column) => column.sortable !== false,
  )?.key
  const labelledColumns = columns.map((column) =>
    column.key === labelledColumnKey
      ? {
          ...column,
          render: (value: T[keyof T], row: T) => (
            <Inline space={1} alignY="center" flexWrap="nowrap">
              <span>
                {column.render
                  ? column.render(value, row)
                  : String(value ?? '')}
              </span>
              {row.notYetInEffect && (
                <NotYetInEffectTag validFrom={row.validFrom} />
              )}
            </Inline>
          ),
        }
      : column,
  )

  return (
    <Stack space={3}>
      <Inline alignY="center" space={3} justifyContent="spaceBetween">
        {Boolean(onDateChange) && Boolean(selectedDate) && (
          <Box style={{ maxWidth: 280 }}>
            <DatePicker
              id={id}
              name={id}
              locale={activeLocale}
              label={dateLabel}
              placeholderText={dateLabel}
              selected={selectedDate}
              handleChange={onDateChange}
              size="sm"
              backgroundColor="blue"
            />
          </Box>
        )}
        {Boolean(system) && (
          <Inline alignY="center" space={1}>
            <Tag active={system === 'I'} onClick={() => onSystemChange?.('I')}>
              {activeLocale === 'is' ? 'Innflutningur' : 'Import'}
            </Tag>
            <Tag active={system === 'U'} onClick={() => onSystemChange?.('U')}>
              {activeLocale === 'is' ? 'Útflutningur' : 'Export'}
            </Tag>
          </Inline>
        )}
      </Inline>
      {error ? (
        <AlertMessage
          type="error"
          title={errorTitle}
          message={formatMessage(m.errorMessage)}
        />
      ) : loading ? (
        <Box display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      ) : (
        <SortableTable
          columns={labelledColumns}
          data={data}
          onRowClick={onRowClick}
        />
      )}
    </Stack>
  )
}
