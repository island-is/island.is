import { FormSystemField } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  Select,
  Box,
} from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
}

export const TimeInput = ({ item }: Props) => {
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

  return (
    <Row marginTop={2}>
      <Column span="2/10">
        <Select
          label="Klukkustund"
          name="timeSelectHour"
          defaultValue={{ label: '00', value: '00' }}
          options={hourList.map((t) => {
            return {
              label: t,
              value: t,
            }
          })}
          size="xs"
          backgroundColor="blue"
        />
      </Column>
      <Box style={{ lineHeight: '90px' }}>:</Box>
      <Column span="2/10">
        <Select
          label="Mínútur"
          name="timeSelectMinute"
          defaultValue={{ label: '00', value: '00' }}
          options={chosenMinuteList()}
          size="xs"
          isSearchable
          isDisabled={item?.fieldSettings?.timeInterval === '1'}
          backgroundColor="blue"
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
