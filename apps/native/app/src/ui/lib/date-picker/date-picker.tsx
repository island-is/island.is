import DatePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import React, { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { useIntl } from 'react-intl'
import { Button, Image, Modal, Platform, StyleSheet, View } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import calendarIcon from '../../assets/icons/calendar.png'
import { token } from '../../utils/dynamic-color'
import { font } from '../../utils/font'
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
  border-color: ${token((t) => t.border.primary)};
  background-color: ${token((t) => t.background.brandMinimal)};
`

const Label = styled(Typography)`
  color: ${token((t) => t.foreground.brand)};
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const DateSelected = styled(Typography)<{ empty: boolean }>`
  padding-left: ${({ theme }) => theme.spacing[1]}px;
  padding-top: 0px;
  padding-bottom: 0px;
  /* Same treatment as a TextField value: the placeholder is light and muted,
     a picked date is semibold. Goes through font() so the weight picks the
     matching IBM Plex face - a bare font-weight does nothing on iOS. */
  ${font({
    fontSize: 16,
    lineHeight: 20,
    fontWeight: ({ empty }) => (empty ? 400 : 600),
    color: ({ empty, theme }) =>
      empty
        ? theme.tokens.foreground.primaryMinimal
        : theme.tokens.foreground.primary,
  })}
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
  const theme = useTheme()
  const scrim = theme.tokens.app.overlay.scrim
  const intl = useIntl()
  const [date, setDate] = useState(selectedDate)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [pickedDate, setPickedDate] = useState<Date | undefined>(selectedDate)

  const maxDate = useMemo(() => {
    // Value or defined max date, which is higher
    if (selectedDate && maximumDate) {
      return selectedDate > maximumDate ? selectedDate : maximumDate
    }
    return maximumDate
  }, [selectedDate, maximumDate])

  const minDate = useMemo(() => {
    // Value or defined min date, which is lower
    if (selectedDate && minimumDate) {
      return selectedDate < minimumDate ? selectedDate : minimumDate
    }
    return minimumDate
  }, [selectedDate, minimumDate])

  const styles = useAnimatedStyle(() => ({
    opacity: withTiming(openDatePicker ? 1 : 0),
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      interpolateColor(openDatePicker ? 1 : 0, [0, 1], ['transparent', scrim]),
    ),
  }))

  return (
    <View>
      <DateInput
        onPress={() => {
          if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
              value: pickedDate ?? selectedDate ?? new Date(),
              maximumDate: maxDate,
              minimumDate: minDate,
              design: 'default',
              onChange: (event, date) => {
                if (event.type === 'set' && date) {
                  onSelectDate?.(date)
                }
                setOpenDatePicker(false)
              },
              mode: 'date',
            })
          } else {
            setOpenDatePicker(true)
          }
        }}
      >
        <View
          style={{
            backgroundColor: theme.tokens.background.brandMinimal,
            flex: 1,
          }}
          pointerEvents="none"
        >
          <Label variant="eyebrow">{label}</Label>
          <DateSelected empty={!selectedDate}>
            {!selectedDate ? placeholder ?? '' : intl.formatDate(selectedDate)}
          </DateSelected>
        </View>
        <Image source={calendarIcon} />
      </DateInput>
      {Platform.OS === 'ios' && (
        <Modal visible={openDatePicker} transparent>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              backdropStyle,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Animated.View
              style={[
                styles,
                { backgroundColor: 'white', padding: 4, borderRadius: 8 },
              ]}
            >
              <DatePicker
                value={pickedDate ?? selectedDate ?? new Date()}
                maximumDate={maxDate}
                minimumDate={minDate}
                onChange={(e) => {
                  const date = e.nativeEvent?.timestamp
                    ? new Date(e.nativeEvent.timestamp)
                    : undefined
                  if (date) {
                    setPickedDate(date)
                  }
                }}
                mode="date"
                display="inline"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 2,
                  padding: 4,
                }}
              >
                <Button
                  title={intl.formatMessage({ id: 'inbox.filterDateCancel' })}
                  onPress={() => setOpenDatePicker(false)}
                  color={theme.tokens.interactive.foreground.primary}
                />
                <Button
                  title={intl.formatMessage({ id: 'inbox.filterDateConfirm' })}
                  disabled={
                    pickedDate?.toISOString() === selectedDate?.toISOString() &&
                    !!selectedDate
                  }
                  onPress={() => {
                    onSelectDate?.(pickedDate ?? new Date())
                    setOpenDatePicker(false)
                  }}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </View>
  )
}
