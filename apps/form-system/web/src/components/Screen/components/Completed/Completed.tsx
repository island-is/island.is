import { m } from '@island.is/form-system/ui'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

export const Completed = () => {
  const { formatMessage } = useIntl()
  const { state } = useApplicationContext()
  return (
    <Box marginTop={2}>
      {state.submitted ? (
        <AlertMessage
          type="success"
          title={formatMessage(m.completedSuccessTitle)}
          message={formatMessage(m.completedSuccessDescription)}
        />
      ) : (
        <AlertMessage
          type="error"
          title={formatMessage(m.completedErrorTitle)}
          message={formatMessage(m.completedErrorDescription)}
        />
      )}
      <Box marginTop={5} display="flex" justifyContent="center">
        <Text>{formatMessage(m.LoremIpsum)}</Text>
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
