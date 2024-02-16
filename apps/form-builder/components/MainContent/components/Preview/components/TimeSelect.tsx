import { GridRow as Row, GridColumn as Column, Input, Select, Box } from '@island.is/island-ui/core'
import { ChangeEvent, useContext, useState } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'

type Option = { label: string; value: string }

export default function TimeSelect() {
  const { lists } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const inputItem = activeItem.data as IInput

  const [timeInput, setTimeInput] = useState('')

  const chosenMinuteList = (): Option[] => {
    const min = minuteList.minuteList.map((t) => ({ label: t, value: t }))

    if (inputItem?.inputSettings === undefined) {
      return min
    } else {
      const interval = inputItem.inputSettings.interval

      if (interval === 0) {
        return min
      } else if (interval === 1) {
        return [{ label: '00', value: '00' }]
      } else if (interval === 2) {
        return halfList.minuteList.map((m) => ({ label: m, value: m }))
      } else if (interval === 3) {
        return quarterList.minuteList.map((m) => ({ label: m, value: m }))
      } else {
        return min
      }
    }
  }

  const handleTimeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    console.log(inputValue)

    const isValidTime = /^(?:[01]?[0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?$/.test(inputValue)
    setTimeInput(inputValue)
    console.log(isValidTime)
    if (isValidTime || inputValue === '') {
      setTimeInput(inputValue)
    }
  }

  return (
    <>
      <Row marginTop={2}>
        <Column span="5/12">
          <Select
            label="Klukkustund"
            name="timeSelectHour"
            defaultValue={{ label: '00', value: '00' }}
            options={hourList.hourList.map((t) => ({ label: t, value: t }))}
            size="xs"
          />
        </Column>
        <Box style={{ lineHeight: '80px' }}>:</Box>
        <Column span="5/12">
          <Select
            label="Mínútur"
            name="timeSelectMinute"
            defaultValue={{ label: '00', value: '00' }}
            options={chosenMinuteList()}
            size="xs"
            isSearchable
            isDisabled={inputItem?.inputSettings?.interval === 1}
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

const hourList = {
  hourList: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
}

const minuteList = {
  minuteList: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
}

const quarterList = {
  minuteList: ['00', '15', '30', '45'],
}

const halfList = {
  minuteList: ['00', '30'],
}
