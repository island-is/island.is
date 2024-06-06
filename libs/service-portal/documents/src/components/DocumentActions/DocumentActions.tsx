import { DocumentV2Actions } from '@island.is/api/schema'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { IconMapIcon } from '@island.is/island-ui/core/types'
import { FC } from 'react'
import { sendForm } from '../../utils/downloadDocumentV2'
import { useUserInfo } from '@island.is/auth/react'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'

interface Props {
  alert?: string
  actions?: Array<DocumentV2Actions>
}
const DocumentActions: FC<Props> = ({ alert, actions }) => {
  const { activeDocument } = useDocumentContext()
  const userInfo = useUserInfo()
  const DEFAULT_ICON: IconMapIcon = 'document'
  return (
    <Box>
      {/* {alert && (
        <Box marginBottom={2}>
          <AlertMessage
            type="success"
            message={
              'Staðfesting á möttöku hefur verið send á dómstóla og ákæruvald.'
            }
          />
        </Box>
      )} */}
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
