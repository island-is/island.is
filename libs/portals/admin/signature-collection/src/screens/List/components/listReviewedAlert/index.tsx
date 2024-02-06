import { Box, AlertBanner } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'

const ListReviewedAlert = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3} marginBottom={7}>
      <AlertBanner
        title={formatMessage(m.listReviewedAlert)}
        variant="success"
      />
    </Box>
  )
}

export default ListReviewedAlert
