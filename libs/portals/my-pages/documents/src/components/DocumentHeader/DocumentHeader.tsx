import { DocumentV2Action, DocumentsV2Category } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
import { useIsMobile } from '@island.is/portals/my-pages/core'
import { useEffect, useRef } from 'react'
import {
  DocumentActionBar,
  DocumentActionBarProps,
} from '../DocumentActionBar/DocumentActionBar'
import DocumentActions from '../DocumentActions/DocumentActions'
import AvatarImage from '../DocumentLine/AvatarImage'
import * as styles from './DocumentHeader.css'
type DocumentHeaderProps = {
  avatar?: string
  sender?: string
  date?: string
  category?: DocumentsV2Category
  actionBar?: DocumentActionBarProps
  actions?: DocumentV2Action[]
  subject?: string
  subjectAriaLabel?: string
  onClick?: () => void
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  avatar,
  sender,
  date,
  category,
  actionBar,
  actions,
  subject,
  subjectAriaLabel,
  onClick,
}) => {
  const wrapper = useRef<HTMLDivElement>(null)
  const { isMobile } = useIsMobile()

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.focus()
    }
  }, [wrapper])

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        position={isMobile ? 'static' : 'sticky'}
        background="white"
        paddingTop={[2, 2, 2, 3]}
        ref={wrapper}
        paddingBottom={3}
        className={styles.container}
      >
        <Text variant="h3" as="h2">
          {subject}
        </Text>
        {!isMobile && actionBar && (
          <Box className={styles.actionBarWrapper}>
            <DocumentActionBar spacing={1} {...actionBar} />
          </Box>
        )}
      </Box>
      <p className={helperStyles.srOnly} aria-live="assertive">
        {subjectAriaLabel}
      </p>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flexStart"
        width="full"
        marginBottom={3}
        onClick={onClick}
        className={styles.actionContainer}
      >
        {avatar && <AvatarImage large img={avatar} background="blue100" />}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
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
                <Text variant="medium">{category.name ?? ''}</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {actions && (
        <Box>
          <DocumentActions />
        </Box>
      )}
    </>
  )
}
