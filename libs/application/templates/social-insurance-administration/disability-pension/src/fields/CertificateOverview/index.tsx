import * as m from '../../lib/messages'
import { SectionRouteEnum } from '../../types/routes'
import { Box, Button, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface CertificateOverviewProps {
  goToScreen?: (id: string) => void
}

export const CertificateOverview: React.FC<CertificateOverviewProps> = ({
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={4}>
      <Divider />
      <Box marginBottom={3}>
        <Box marginTop={2} display="flex" justifyContent="spaceBetween">
          <Text variant="h4" as="h3" marginBottom={2}>
            {formatMessage(m.disabilityCertificate.disabilityTitle)}
          </Text>
          <Button
            variant="utility"
            icon="open"
            iconType="outline"
            onClick={() => {
              goToScreen?.(SectionRouteEnum.DISABILITY_CERTIFICATE)
            }}
          >
            {formatMessage(m.shared.view)}
          </Button>
        </Box>
        <Text>
          {formatMessage(m.disabilityCertificate.certificateAvailable)}
        </Text>
      </Box>
      <Divider />
    </Stack>
  )
}

export default CertificateOverview
