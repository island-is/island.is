import { useFormContext } from 'react-hook-form'
import { Button } from '@island.is/island-ui/core'

export const Participants = () => {
  const { setValue } = useFormContext()

  const uploadData = () => {
    console.log('uploadingData')
    const data = [
      {
        name: 'testing',
        ssn: '92929292-3833',
      },
      {
        name: 'testing2',
        ssn: '92929292-3833',
      },
    ]
    setValue('participantList', data)
  }
  return <Button onClick={() => uploadData()} title="test" />
}
