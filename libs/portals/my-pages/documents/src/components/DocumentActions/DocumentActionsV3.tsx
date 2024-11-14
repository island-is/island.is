import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { IconMapIcon } from '@island.is/island-ui/core/types'
import { sendForm } from '../../utils/downloadDocumentV2'
import { useUserInfo } from '@island.is/auth/react'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'

const DocumentActions = () => {
  const { activeDocument } = useDocumentContext()
  const userInfo = useUserInfo()
  const DEFAULT_ICON: IconMapIcon = 'document'
  const actions = activeDocument?.actions
  const alert = activeDocument?.alert

  return (
    <Box>
      {alert && (
        <Box marginBottom={1}>
          <AlertMessage type="success" message={alert.title} />
        </Box>
      )}
      {actions && (
        <Box
          marginBottom={2}
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
          {actions.map((a) => {
            return (
              <Box marginRight={1} marginTop={1}>
                {a.type === 'url' && a.data && (
                  <a href={a.data}>
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
                )}
                {a.type === 'file' && activeDocument && (
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
