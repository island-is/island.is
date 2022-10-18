import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { employer } from '../../lib/messages'

export const IsEmployerValid: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginY={5}>
        {console.log(application)}
        <AlertMessage
          type="error"
          title={formatText(
            employer.general.employerIsNotValid,
            application,
            formatMessage,
          )}
        />
      </Box>
    </Box>
  )
}
