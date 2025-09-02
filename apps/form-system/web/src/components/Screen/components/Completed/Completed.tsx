import {
  Box,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { useIntl } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { webMessages } from '@island.is/form-system/ui'


export const Completed = () => {
  const { formatMessage } = useIntl()
  const { state } = useApplicationContext()
  return (
    <Box marginTop={2}>
        {state.submitted ?         <AlertMessage
            type="success"
            title={formatMessage(webMessages.completedSuccessTitle)}
            message={formatMessage(webMessages.completedSuccessDescription)}
          /> :         <AlertMessage
            type="error"
            title={formatMessage(webMessages.completedErrorTitle)}
            message={formatMessage(webMessages.completedErrorDescription)}
          />}
    </Box>
  )
}
