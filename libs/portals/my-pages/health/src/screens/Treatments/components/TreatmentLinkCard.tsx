import { Box, Icon, Text } from '@island.is/island-ui/core'
import { LinkResolver } from '@island.is/portals/my-pages/core'

interface Props {
  label: string
  to: string
  text?: string
}

export const TreatmentLinkCard = ({ label, to, text }: Props) => (
  <LinkResolver href={to}>
    <Box
      background="white"
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      height="full"
    >
      <Box>
        <Text variant="h5" color="blue400">
          {label}
        </Text>
        {text && <Text variant="medium">{text}</Text>}
      </Box>
      <Icon icon="arrowForward" color="blue400" size="small" />
    </Box>
  </LinkResolver>
)

export default TreatmentLinkCard
