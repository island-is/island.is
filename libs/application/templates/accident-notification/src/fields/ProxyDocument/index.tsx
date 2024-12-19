import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { powerOfAttorney } from '../../lib/messages'

export const ProxyDocument = () => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={2}>
      <Inline alignY="center" space={1}>
        <Text>
          {formatMessage(powerOfAttorney.upload.powerOfAttorneyFileLinkText)}
        </Text>
        <Button variant="text">
          <a
            href={
              'https://assets.ctfassets.net/8k0h54kbe6bj/1iPv7b9rJhuEyihQ9NlSTk/6fa1595e12237ea54b923c0693de9ef8/umbo___vegna_tilkynningar_slys.docx'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {formatMessage(
              powerOfAttorney.upload.powerOfAttorneyFileLinkButtonName,
            )}
          </a>
        </Button>
      </Inline>
    </Box>
  )
}
