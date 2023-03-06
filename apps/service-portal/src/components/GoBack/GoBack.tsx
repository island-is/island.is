import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useNavigate } from 'react-router-dom'
import { m } from '@island.is/service-portal/core'

export const GoBack = () => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  return (
    <Box display={['none', 'none', 'block']} printHidden marginBottom={3}>
      <Button
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
        truncate
        onClick={() => navigate('/')}
      >
        {formatMessage(m.goBackToDashboard)}
      </Button>
    </Box>
  )
}

export default GoBack
