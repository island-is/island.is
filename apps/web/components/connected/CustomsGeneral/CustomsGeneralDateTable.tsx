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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

interface Props {
  columns: SortableTableColumn<AnyRecord>[]
  data: AnyRecord[]
  loading: boolean
  error?: Error
  selectedDate: Date
  onDateChange: (date: Date) => void
  dateLabel: string
  errorTitle: string
  kerfi?: 'I' | 'U'
  onKerfiChange?: (kerfi: 'I' | 'U') => void
  onRowClick?: (row: AnyRecord) => void
}

export const toApiDate = (date: Date) => `${date.toISOString().split('.')[0]}Z`

export const CustomsGeneralDateTable = ({
  columns,
  data,
  loading,
  error,
  selectedDate,
  onDateChange,
  dateLabel,
  errorTitle,
  kerfi,
  onKerfiChange,
  onRowClick,
}: Props) => {
  const { activeLocale } = useI18n()

  return (
    <Stack space={3}>
      <Inline alignY="center" space={3} justifyContent="spaceBetween">
        <Box style={{ maxWidth: 280 }}>
          <DatePicker
            id="customs-general-dags"
            name="customs-general-dags"
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
        <AlertMessage type="error" title={errorTitle} message={error.message} />
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
