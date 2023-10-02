import { Box, Text } from '@island.is/island-ui/core'
import AvatarImage from '../DocumentLine/AvatarImage'
import { DocumentCategory } from '@island.is/api/schema'
import * as styles from './DocumentHeader.css'
import {
  DocumentActionBar,
  DocumentActionBarProps,
} from '../DocumentActionBar/DocumentActionBar'
import { downloadFile } from '../../utils/downloadDocument'
import { useUserInfo } from '@island.is/auth/react'
import { ActiveDocumentType } from '../../screens/Overview/Overview'

type DocumentHeaderProps = {
  avatar?: string
  sender?: string
  date?: string
  category?: DocumentCategory
  actionBar?: DocumentActionBarProps
  activeDocument?: ActiveDocumentType
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  avatar,
  sender,
  date,
  category,
  actionBar,
  activeDocument,
}) => {
  const userInfo = useUserInfo()

  return (
    <Box display="flex">
      {avatar && <AvatarImage large img={avatar} background="blue100" />}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        marginBottom={4}
        marginLeft={2}
      >
        {sender && (
          <Text variant="medium" fontWeight="semiBold">
            {sender}
          </Text>
        )}
        <Box
          className={styles.titleText}
          display="flex"
          justifyContent="flexStart"
          alignItems="center"
        >
          {date && <Text variant="medium">{date}</Text>}
          {category && (
            <Box className={styles.categoryDivider}>
              <Text variant="medium">{category.name}</Text>
            </Box>
          )}
        </Box>
      </Box>
      {actionBar && (
        <Box className={styles.actionBarWrapper}>
          <DocumentActionBar
            spacing={1}
            {...actionBar}
            onPrintClick={
              activeDocument
                ? () => downloadFile(activeDocument, userInfo)
                : undefined
            }
            activeDocument={activeDocument}
          />
        </Box>
      )}
    </Box>
  )
}
