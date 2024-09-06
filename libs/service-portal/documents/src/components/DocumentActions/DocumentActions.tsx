import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { IconMapIcon } from '@island.is/island-ui/core/types'
import { sendForm } from '../../utils/downloadDocumentV2'
import { useUserInfo } from '@island.is/auth/react'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { useLocale } from '@island.is/localization'
import { messages } from '../../utils/messages'

const DocumentActions = () => {
  const { activeDocument } = useDocumentContext()
  const userInfo = useUserInfo()
  const DEFAULT_ICON: IconMapIcon = 'document'
  const actions = activeDocument?.actions?.filter(
    (action) => action.type !== 'confirmation',
  )
  const { formatMessage } = useLocale()

  return (
    <Box>
      {
        <Box marginBottom={2}>
          <AlertMessage
            type="success"
            message={formatMessage(messages.confirmation)}
          />
        </Box>
      }
      {actions && (
        <Box
          marginBottom={2}
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
          {actions.map((a) => {
            if (a.type === 'url' && a.data) {
              return (
                <Box marginRight={1}>
                  <a
                    href={
                      '/minarsidur/log-og-reglur/domsmal/410c3e69-f272-47f0-9fec-119e9dfd238e/fyrirkall' // Temp hardcoded value  <a href={a.data}>
                    }
                  >
                    <Button
                      as="span"
                      unfocusable
                      colorScheme="default"
                      icon={(a.icon as IconMapIcon) ?? DEFAULT_ICON}
                      iconType="outline"
                      size="default"
                      variant="utility"
                    >
                      {a.title}
                    </Button>
                  </a>
                </Box>
              )
            }
            return (
              <Box marginRight={1}>
                {activeDocument && (
                  <Button
                    size="small"
                    variant="utility"
                    icon={(a.icon as IconMapIcon) ?? DEFAULT_ICON}
                    iconType="outline"
                    onClick={() =>
                      sendForm(
                        activeDocument.id,
                        a.data ?? activeDocument.downloadUrl,
                        userInfo,
                      )
                    }
                  >
                    {a.title}
                  </Button>
                )}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default DocumentActions
