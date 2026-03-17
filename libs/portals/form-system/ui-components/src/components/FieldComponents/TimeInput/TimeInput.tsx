import { FormSystemField } from '@island.is/api/schema'
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Select,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const TimeInput = ({ item, dispatch }: Props) => {
  const { control, setValue, watch, trigger } = useFormContext()
  const { formatMessage } = useIntl()
  // If value from backend is a string like "13:45", split and set fields
  useEffect(() => {
    if (
      typeof item.values === 'string' &&
      (item.values as string).includes(':')
    ) {
      const [h, m] = (item.values as string).split(':')
      setValue(`${item.id}.hour`, { label: h, value: h })
      setValue(`${item.id}.minute`, { label: m, value: m })
    }
  }, [item.values, item.id, setValue])

  // Watch hour and minute fields for this item
  const hour = watch(`${item.id}.hour`)
  const minute = watch(`${item.id}.minute`)

  // Dispatch combined time string when both are set
  useEffect(() => {
    if (
      dispatch &&
      hour &&
      minute &&
      hour.value !== undefined &&
      minute.value !== undefined &&
      hour.value !== '' &&
      minute.value !== ''
    ) {
      const timeString = `${hour.value}:${minute.value}`
      dispatch({
        type: 'SET_TIME',
        payload: {
          id: item.id,
          value: timeString,
        },
      })
    }
  }, [dispatch, item.id, hour, minute])

  // 0: Minute
  // 1: Hourly
  // 2: Half hour
  // 3: Quarter
  const chosenMinuteList = (): { label: string; value: string }[] => {
    const createOptions = (list: string[]) =>
      list.map((t) => ({ label: t, value: t }))

    const interval = item?.fieldSettings?.timeInterval

    switch (interval) {
      case '1':
        return [{ label: '00', value: '00' }]
      case '2':
        return createOptions(halfList.minuteList)
      case '3':
        return createOptions(quarterList.minuteList)
      default:
        return createOptions(minuteList)
    }
  }
  const timeValue = getValue(item, 'time')
  const [hourValue, minuteValue] = timeValue
    ? timeValue.split(':')
    : [undefined, undefined]

  return (
    <Row marginTop={2}>
      <Column span="3/10">
        <Controller
          key={`hour.${item.id}`}
          name={`${item.id}.hour`}
          control={control}
          defaultValue={
            hourValue ? { label: hourValue, value: hourValue } : undefined
          }
          rules={{
            required: {
              value: item?.isRequired ?? false,
              message: formatMessage(m.pickHour),
            },
          }}
          render={({ field, fieldState }) => (
            <Select
              label={formatMessage(m.hourInput)}
              name={field.name}
              value={field.value}
              options={hourList.map((t) => ({
                label: t,
                value: t,
              }))}
              size="xs"
              required={item?.isRequired ?? false}
              backgroundColor="blue"
              onChange={(opt) => {
                field.onChange(opt)
                trigger(field.name)
              }}
              onBlur={field.onBlur}
              hasError={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
      <Box style={{ lineHeight: '90px' }}>:</Box>
      <Column span="3/10">
        <Controller
          key={`minute.${item.id}`}
          name={`${item.id}.minute`}
          control={control}
          defaultValue={
            minuteValue ? { label: minuteValue, value: minuteValue } : undefined
          }
          rules={{
            required: {
              value: item?.isRequired ?? false,
              message: formatMessage(m.pickMinute),
            },
          }}
          render={({ field, fieldState }) => (
            <Select
              label={formatMessage(m.minuteInput)}
              name={field.name}
              value={field.value}
              options={chosenMinuteList()}
              size="xs"
              required={item?.isRequired ?? false}
              isSearchable
              isDisabled={item?.fieldSettings?.timeInterval === '1'}
              backgroundColor="blue"
              onChange={(opt) => {
                field.onChange(opt)
                trigger(field.name)
              }}
              onBlur={field.onBlur}
              hasError={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </Column>
    </Row>
  )
}

const hourList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
]

const minuteList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
]

const quarterList = {
  minuteList: ['00', '15', '30', '45'],
}

const halfList = {
  minuteList: ['00', '30'],
}
