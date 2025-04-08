import React, { useRef, useState } from 'react'
import { DateObject, Calendar } from 'react-multi-date-picker'
import {
  Select,
  GridRow as Row,
  GridColumn as Col,
  Stack,
  Option,
  Text,
  RadioButton,
  Box,
  Input,
} from '@island.is/island-ui/core'
import { SingleValue } from 'react-select'
import { icelandicLocale } from './icelandicLocale'
import * as styles from './styles.css'
import {
  addCurrencyFormatting,
  getSumFromArray,
} from '../../../utils/currencyFormatter'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface YearOption {
  value: number
  label: string
}

export const HomestayOverview = () => {
  const { formatMessage } = useIntl()
  const datePickerRef = useRef(null)
  const currentYear = new Date().getFullYear()

  const [selectedDates, setSelectedDates] = useState<DateObject[]>([])
  const [currentMonth, setCurrentMonth] = useState<number>(0)
  const [monthArray, setMonthArray] = useState<string[]>(new Array(12).fill(''))
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [maxDate, setMaxDate] = useState<Date>(new Date(currentYear, 11, 31))
  const [minDate, setMinDate] = useState<Date>(new Date(currentYear, 0, 1))
  const [radio, setRadio] = useState<boolean | null>(null)

  const yearOptions: YearOption[] = Array.from({ length: 6 }, (_, index) => {
    const year = currentYear - index
    return { value: year, label: year.toString() }
  })

  const handleRadio = (state: boolean) => setRadio(state)

  const handleYearSelect = (e: SingleValue<Option<number>>) => {
    if (e) {
      const year = e.value
      setSelectedYear(year)
      setMaxDate(new Date(year, 11, 31))
      setMinDate(new Date(year, 0, 1))
      setMonthArray(new Array(12).fill(''))
      setSelectedDates([])
      setCurrentMonth(0)
    }
  }

  const handleDateChange = (dates: DateObject[]) => {
    setSelectedDates(dates)
    if (dates.filter((d) => d.monthIndex === currentMonth).length === 0) {
      setMonthArray((prev) => {
        const newArr = [...prev]
        newArr[currentMonth] = ''
        return newArr
      })
    }
  }

  const handleMonthChange = (date: DateObject) =>
    setCurrentMonth(date.month.index)

  const handleMonthTotalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMonthArray((prev) => {
      const newArray = [...prev]
      newArray[currentMonth] = addCurrencyFormatting(e)
      return newArray
    })
  }

  const monthName = icelandicLocale.months[currentMonth][0]
  const selectedDatesThisMonth = selectedDates.filter(
    (d) => d.monthIndex === currentMonth,
  ).length

  return (
    <Stack space={3}>
      <Text variant="h3">{formatMessage(m.homestayOverview)}</Text>
      <Row>
        <Col span="3/10">
          <Select
            label="Veldu ár"
            options={yearOptions}
            defaultValue={yearOptions[0]}
            onChange={handleYearSelect}
            size="sm"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text>{formatMessage(m.homestayOverviewRadio)}</Text>
        </Col>
      </Row>
      <Row>
        {[true, false].map((value) => (
          <Col key={value.toString()} span="5/10">
            <Box onClick={() => handleRadio(value)}>
              <RadioButton
                label={formatMessage(value ? m.yes : m.no)}
                large
                backgroundColor="white"
                onChange={() => handleRadio(value)}
                checked={radio === value}
              />
            </Box>
          </Col>
        ))}
      </Row>
      {radio && (
        <Row>
          <Col span="5/10">
            <Calendar
              multiple
              key={selectedYear}
              value={selectedDates}
              onChange={handleDateChange}
              format="DD/MM/YY"
              disableYearPicker
              highlightToday={false}
              maxDate={maxDate}
              minDate={minDate}
              currentDate={
                new DateObject({ year: selectedYear, month: 1, day: 1 })
              }
              ref={datePickerRef}
              locale={icelandicLocale}
              className={styles.calendar}
              shadow={false}
              onMonthChange={handleMonthChange}
            />
          </Col>
          <Col span="5/10">
            <Box
              display="flex"
              justifyContent="spaceBetween"
              flexDirection="column"
              style={{ height: '100%' }}
            >
              <Stack space={4}>
                <Text variant="h3">{monthName}</Text>
                {selectedDatesThisMonth > 0 && (
                  <Input
                    name="monthTotal"
                    label={`${formatMessage(
                      m.amountIn,
                    )} ${monthName.toLowerCase()}`}
                    size="sm"
                    onChange={handleMonthTotalChange}
                    value={monthArray[currentMonth]}
                  />
                )}
              </Stack>
              <Box>
                <Stack space={1}>
                  {[
                    { label: m.totalDays, value: selectedDates.length },
                    {
                      label: m.totalAmount,
                      value: `${getSumFromArray(monthArray)} kr.`,
                    },
                  ].map(({ label, value }) => (
                    <Box
                      key={label.id}
                      display="flex"
                      flexDirection="row"
                      justifyContent="spaceBetween"
                    >
                      <Text fontWeight="semiBold">{`${formatMessage(
                        label,
                      )}:`}</Text>
                      <Text>{value}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Col>
        </Row>
      )}
    </Stack>
  )
}
