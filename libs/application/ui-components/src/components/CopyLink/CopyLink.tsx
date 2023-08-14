import { FC } from 'react'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import copyToClipboard from 'copy-to-clipboard'
import { useLocale } from '@island.is/localization'
import { coreMessages, coreErrorMessages } from '@island.is/application/core'

interface CopyLinkProps {
  linkUrl: string
  buttonTitle?: string
}

const CopyLink: FC<React.PropsWithChildren<CopyLinkProps>> = ({
  linkUrl,
  buttonTitle = 'Afrita tengil',
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      background="blue100"
      display={['block', 'flex']}
      alignItems="center"
      justifyContent="spaceBetween"
      padding={3}
      borderRadius="large"
    >
      <Box style={{ overflowWrap: 'anywhere' }} paddingRight={4}>
        <Text color="blue400">{linkUrl}</Text>
      </Box>
      <Box marginTop={[3, 0]}>
        <Button
          onClick={() => {
            copyToClipboard(linkUrl)
            const copied = copyToClipboard(linkUrl)
            if (!copied) {
              return toast.error(
                formatMessage(
                  coreErrorMessages.copyLinkErrorToast.defaultMessage,
                ),
              )
            }
            toast.success(
              formatMessage(coreMessages.copyLinkSuccessToast.defaultMessage),
            )
          }}
          variant="ghost"
          nowrap
          colorScheme="light"
          icon="copy"
          iconType="outline"
          size="small"
        >
          {buttonTitle}
        </Button>
      </Box>
    </Box>
  )
}

export default CopyLink
