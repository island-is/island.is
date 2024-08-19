import React, { useState } from 'react'
import styled from 'styled-components/native'
import DatePicker from 'react-native-date-picker'

import calendarIcon from '../../assets/icons/calendar.png'
import { Typography } from '../typography/typography'
import { dynamicColor } from '@ui/utils/dynamic-color'
import { useIntl } from 'react-intl'
import { View, Image } from 'react-native'

const Host = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[1]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

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
  font-weight: ${({ empty }) => (empty ? '400' : '600')};
`

interface DatePickerProps {
  label: string
  placeholder?: string
  minimumDate?: Date
  maximumDate?: Date
}

export function DatePickerInput({
  label,
  placeholder,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const intl = useIntl()
  const [date, setDate] = useState(new Date())
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [dateSelected, setDateSelected] = useState(false)

  return (
    <Host>
      <DateInput onPress={() => setOpenDatePicker(true)}>
        <View>
          <Label variant="eyebrow">{label}</Label>
          <DateSelected empty={!dateSelected}>
            {!dateSelected ? placeholder ?? '' : intl.formatDate(date)}
          </DateSelected>
        </View>
        <Image source={calendarIcon} style={{}} />
      </DateInput>
      <DatePicker
        mode="date"
        title={null}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        modal
        open={openDatePicker}
        date={date}
        confirmText={intl.formatMessage({ id: 'inbox.filterDateConfirm' })}
        cancelText={intl.formatMessage({ id: 'inbox.filterDateCancel' })}
        onConfirm={(date) => {
          setOpenDatePicker(false)
          setDate(date)
          setDateSelected(true)
        }}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
      />
    </Host>
  )
}
