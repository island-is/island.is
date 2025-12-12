import { useCallback, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { FormControl, TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

interface TimeDuration {
  startTime?: string
  endTime?: string
}

const SimpleTimeDurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [time, setTime] = useState<TimeDuration>(sdk.field.getValue() ?? {})

  const updateTime = useCallback(
    (field: keyof TimeDuration, value: string) => {
      setTime((prevTime) => {
        const updatedTime = {
          ...prevTime,
          [field]: value,
        }
        sdk.field.setValue(updatedTime)
        return updatedTime
      })
    },
    [sdk.field],
  )

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
        />
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
        />
      </TextInput.Group>
      <FormControl.HelpText>For example, 13:30 - 15:30</FormControl.HelpText>
    </FormControl>
  )
}

export default SimpleTimeDurationField
