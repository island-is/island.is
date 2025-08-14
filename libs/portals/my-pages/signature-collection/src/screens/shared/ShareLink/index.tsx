import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'

const ShareLink = (slug: { slug: string }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      background="blue100"
      borderRadius="large"
      display={['block', 'flex', 'flex']}
      justifyContent="spaceBetween"
      alignItems="center"
      padding={3}
      marginTop={2}
    >
      <Text marginBottom={[2, 0, 0]} variant="medium" color="blue600">
        {formatMessage(m.copyLinkDescription)}
      </Text>
      <Box>
        <Button
          onClick={() => {
            const copied = copyToClipboard(
              `${document.location.origin}${slug.slug}`,
            )
            if (!copied) {
              return toast.error(formatMessage(m.copyLinkError))
            }
            toast.success(formatMessage(m.copyLinkSuccess))
          }}
          variant="text"
          icon="link"
          size="medium"
        >
          {formatMessage(m.copyLinkButton)}
        </Button>
      </Box>
    </Box>
  )
}

export default ShareLink
