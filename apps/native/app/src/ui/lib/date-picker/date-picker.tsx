import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'

import { useIntl } from 'react-intl'
import { Image, View } from 'react-native'
import calendarIcon from '../../assets/icons/calendar.png'
import { dynamicColor } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'

const DateInput = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[1]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: 1px;
  border-style: solid;
  border-color: ${dynamicColor(
    (props) => ({
      dark: 'shade500',
      light: props.theme.color.blue200,
    }),
    true,
  )};
  background-color: ${dynamicColor((props) => ({
    dark: 'shade300',
    light: props.theme.color.blue100,
  }))};
`

const Label = styled(Typography)`
  color: ${dynamicColor((props) => ({
    dark: 'foreground',
    light: props.theme.color.blue400,
  }))};
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const DateSelected = styled(Typography)<{ empty: boolean }>`
  padding-left: ${({ theme }) => theme.spacing[1]}px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-weight: ${({ empty }) => (empty ? 300 : 600)};
`

interface DatePickerProps {
  label: string
  placeholder?: string
  minimumDate?: Date
  maximumDate?: Date
  selectedDate?: Date
  onSelectDate?: (date: Date) => void
}

export const DatePickerInput = ({
  label,
  placeholder,
  maximumDate,
  minimumDate,
  onSelectDate,
  selectedDate,
}: DatePickerProps) => {
  const intl = useIntl()
  const [date, setDate] = useState(selectedDate)
  const [openDatePicker, setOpenDatePicker] = useState(false)

  useEffect(() => {
    setDate(selectedDate)
  }, [selectedDate])

  return (
    <View>
      <DateInput onPress={() => setOpenDatePicker(true)}>
        <View>
          <Label variant="eyebrow">{label}</Label>
          <DateSelected empty={!date}>
            {!date ? placeholder ?? '' : intl.formatDate(date)}
          </DateSelected>
        </View>
        <Image source={calendarIcon} />
      </DateInput>
      <DatePicker
        mode="date"
        title={null}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        modal
        open={openDatePicker}
        date={date ?? new Date()}
        confirmText={intl.formatMessage({ id: 'inbox.filterDateConfirm' })}
        cancelText={intl.formatMessage({ id: 'inbox.filterDateCancel' })}
        onConfirm={(date) => {
          setOpenDatePicker(false)
          setDate(date)
          onSelectDate?.(date)
        }}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
      />
    </View>
  )
}
