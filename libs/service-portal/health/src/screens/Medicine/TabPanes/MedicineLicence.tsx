import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../../lib/messages'

export const MedicineLicence = () => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={4}>
      <IntroHeader
        title={formatMessage(messages.medicineLicenseIntroTitle)}
        intro={formatMessage(messages.medicineLicenseIntroText)}
        isSubheading
      />
    </Box>
  )
}
