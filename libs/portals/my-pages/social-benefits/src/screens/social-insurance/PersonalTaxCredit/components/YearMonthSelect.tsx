import { Column, Columns, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../../../lib/messages'

type Option = { label: string; value: number }

interface Props {
  yearOptions: Option[]
  monthOptions: Option[]
  selectedYear: number | null
  selectedMonth: number | null
  onYearChange: (year: number | null) => void
  onMonthChange: (month: number | null) => void
  yearName: string
  monthName: string
  yearRequired?: boolean
  monthRequired?: boolean
  backgroundColor?: 'blue' | 'white'
}

export const YearMonthSelect: FC<Props> = ({
  yearOptions,
  monthOptions,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  yearName,
  monthName,
  yearRequired,
  monthRequired,
  backgroundColor = 'blue',
}) => {
  const { formatMessage } = useLocale()

  return (
    <Columns space={3} alignY="bottom">
      <Column>
        <Select
          name={yearName}
          label={formatMessage(m.fromWhatTime)}
          placeholder={formatMessage(m.theYear)}
          size="xs"
          backgroundColor={backgroundColor}
          options={yearOptions}
          value={
            selectedYear != null
              ? yearOptions.find((o) => o.value === selectedYear) ?? null
              : null
          }
          onChange={(opt) => onYearChange(opt ? Number(opt.value) : null)}
          required={yearRequired}
        />
      </Column>
      <Column>
        <Select
          name={monthName}
          label={formatMessage(m.month)}
          placeholder={formatMessage(m.month)}
          size="xs"
          backgroundColor={backgroundColor}
          options={monthOptions}
          value={
            selectedMonth != null
              ? monthOptions.find((o) => o.value === selectedMonth) ?? null
              : null
          }
          onChange={(opt) => onMonthChange(opt ? Number(opt.value) : null)}
          required={monthRequired}
          isDisabled={selectedYear == null}
        />
      </Column>
    </Columns>
  )
}
