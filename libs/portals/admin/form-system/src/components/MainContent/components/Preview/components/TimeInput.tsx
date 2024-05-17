import { FormSystemInput } from "@island.is/api/schema"
import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Select,
  Box,
} from '@island.is/island-ui/core'
import { ChangeEvent, useContext, useState } from "react"
import ControlContext from "../../../../../context/ControlContext"

interface Props {
  currentItem: FormSystemInput
}

const TimeInput = ({ currentItem }: Props) => {
  const [timeInput, setTimeInput] = useState('')

  // 0: Minute
  // 1: Hourly
  // 2: Half hour
  // 3: Quarter
  const chosenMinuteList = (): { label: string, value: string }[] => {
    const min = minuteList.map((t) => {
      return {
        label: t,
        value: t,
      }
    })

    if (currentItem?.inputSettings === undefined) {
      return min
    } else {
      const interval = currentItem.inputSettings.interval

      if (interval === 0) {
        return min
      } else if (interval === 1) {
        return [{ label: '00', value: '00' }]
      } else if (interval === 2) {
        return halfList.minuteList.map((m) => {
          return {
            label: m,
            value: m,
          }
        })
      } else if (interval === 3) {
        return quarterList.minuteList.map((m) => {
          return {
            label: m,
            value: m,
          }
        })
      } else {
        // Handle other cases if needed
        return min
      }
    }
  }

  const handleTimeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = e.target.value

    const isValidTime =
      /^(?:[01]?[0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?$/.test(inputValue)
    setTimeInput(inputValue)
    if (isValidTime || inputValue === '') {
      setTimeInput(inputValue)
    }
  }

  return (
    <>
      <Row marginTop={2}>
        <Column span="3/12">
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
          />
        </Column>
        <Box style={{ lineHeight: '90px' }}>:</Box>
        <Column span="3/12">
          <Select
            label="Mínútur"
            name="timeSelectMinute"
            defaultValue={{ label: '00', value: '00' }}
            options={chosenMinuteList()}
            size="xs"
            isSearchable
            isDisabled={currentItem?.inputSettings?.interval === 1}
          />
        </Column>
      </Row>
      <Input
        name="timeInput"
        value={timeInput}
        onChange={(e) => handleTimeInput(e)}
      />
    </>
  )
}

export default TimeInput

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
