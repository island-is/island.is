import { Box, Button, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

interface Props {
  onClick: () => void
}

export const ConversationBackButton = ({ onClick }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <Button
      variant="text"
      size="default"
      colorScheme="light"
      aria-label={formatMessage(m.goBack)}
      onClick={onClick}
    >
      {/* Button's "text" variant is display:inline, so a bare icon child is
      subject to inline baseline alignment instead of true centering — wrap
      it so it centers correctly within the row it shares with other icons. */}
      <Box display="inlineFlex" alignItems="center" justifyContent="center">
        <Icon icon="arrowBack" type="filled" />
      </Box>
    </Button>
  )
}

export default ConversationBackButton
