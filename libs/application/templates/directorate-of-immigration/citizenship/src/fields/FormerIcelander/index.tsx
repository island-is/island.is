import { useState } from 'react'
import { information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'

export const FormerIcelander = ({ application }: any) => {
  const { answers } = application

  console.log('ansers', answers)
  const [isFormerIcelander, setIsFormerIcelander] = useState(
    getValueViaPath(answers, 'formerIcelander') as string,
  )

  const { formatMessage } = useLocale()

  const handleIsFormerIcelanderChange = (value: string) => {
    setIsFormerIcelander(value)
  }

  return (
    <Box>
      <RadioController
        id={'formerIcelander'}
        split="1/2"
        onSelect={(value) => {
          handleIsFormerIcelanderChange(value)
        }}
        defaultValue={isFormerIcelander ? 'Yes' : 'No'}
        options={[
          {
            value: 'Yes',
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: 'No',
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />
      {(!isFormerIcelander || isFormerIcelander === 'No') && (
        <AlertMessage
          type="error"
          title={formatMessage(information.labels.formerIcelander.alertTitle)}
          message={formatMessage(
            information.labels.formerIcelander.alertDescription,
          )}
        />
      )}
    </Box>
  )
}
