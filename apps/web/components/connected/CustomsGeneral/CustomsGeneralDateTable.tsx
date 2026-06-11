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

import { m } from './translation.strings'

interface Props<T extends Record<string, unknown>> {
  columns: SortableTableColumn<T>[]
  data: T[]
  loading: boolean
  error?: Error
  selectedDate: Date
  onDateChange: (date: Date) => void
  dateLabel: string
  errorTitle: string
  id?: string
  kerfi?: 'I' | 'U'
  onKerfiChange?: (kerfi: 'I' | 'U') => void
  onRowClick?: (row: T) => void
}

export const toApiDate = (date: Date) => `${date.toISOString().split('.')[0]}Z`

export const CustomsGeneralDateTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  error,
  selectedDate,
  onDateChange,
  dateLabel,
  errorTitle,
  id: idProp,
  kerfi,
  onKerfiChange,
  onRowClick,
}: Props<T>) => {
  const { activeLocale } = useI18n()
  const { formatMessage } = useIntl()
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <Stack space={3}>
      <Inline alignY="center" space={3} justifyContent="spaceBetween">
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
        {Boolean(kerfi) && (
          <Inline alignY="center" space={1}>
            <Tag active={kerfi === 'I'} onClick={() => onKerfiChange?.('I')}>
              {activeLocale === 'is' ? 'Innflutningur' : 'Import'}
            </Tag>
            <Tag active={kerfi === 'U'} onClick={() => onKerfiChange?.('U')}>
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
        <SortableTable columns={columns} data={data} onRowClick={onRowClick} />
      )}
    </Stack>
  )
}
