import { Box, AlertMessage, Text } from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { useIntl } from 'react-intl'
import { webMessages } from '@island.is/form-system/ui'

export const Completed = () => {
  const { formatMessage } = useIntl()
  const { state } = useApplicationContext()
  return (
    <Box marginTop={2}>
      {state.submitted ? (
        <AlertMessage
          type="success"
          title={formatMessage(webMessages.completedSuccessTitle)}
          message={formatMessage(webMessages.completedSuccessDescription)}
        />
      ) : (
        <AlertMessage
          type="error"
          title={formatMessage(webMessages.completedErrorTitle)}
          message={formatMessage(webMessages.completedErrorDescription)}
        />
      )}
      <Box marginTop={5} display="flex" justifyContent="center">
        <Text>{formatMessage(webMessages.LoremIpsum)}</Text>
      </Box>
      <Box marginTop={5} display="flex" justifyContent="center">
        <img
          src={'./assets/images/train.svg'}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </Box>
    </Box>
  )
}
