import { useEffect, useState } from 'react'
import { TextInput, FormControl } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

interface TimeDuration {
  startTime?: string
  endTime?: string
}

const TimeDurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [time, setTime] = useState<TimeDuration>(sdk.field.getValue() ?? {})

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const updateTime = (field: keyof TimeDuration, value: string) => {
    setTime((prevTime) => {
      const updatedTime = {
        ...prevTime,
        [field]: value,
      }
      sdk.field.setValue(updatedTime)
      return updatedTime
    })
  }

  return (
    <FormControl>
      <TextInput.Group spacing="spacingS">
        <TextInput
          type="time"
          value={time.startTime}
          style={{ width: '150px' }}
          size="small"
          name="start-time"
          placeholder="Start time"
          onChange={(ev) => {
            updateTime('startTime', ev.target.value)
          }}
        ></TextInput>
        {' - '}
        <TextInput
          type="time"
          value={time.endTime}
          style={{ width: '150px' }}
          size="small"
          name="end-time"
          placeholder="End time"
          onChange={(ev) => {
            updateTime('endTime', ev.target.value)
          }}
        ></TextInput>
      </TextInput.Group>
      <FormControl.HelpText>Ex. 12:00 - 14:00</FormControl.HelpText>
    </FormControl>
  )
}

export default TimeDurationField
