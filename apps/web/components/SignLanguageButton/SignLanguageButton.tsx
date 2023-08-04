import { Box, Button, Hidden } from '@island.is/island-ui/core'
import { useState, ReactNode } from 'react'
import { EmbeddedVideo } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import { Modal } from '@island.is/react/components'

import * as styles from './SignLanguageButton.css'

interface SignLanguageButtonProps {
  videoUrl: string
  content: ReactNode
}

export const SignLanguageButton = ({
  videoUrl,
  content,
}: SignLanguageButtonProps) => {
  const { activeLocale } = useI18n()

  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <Modal
        closeButtonLabel="Close"
        label="sign-language-modal"
        id="sign-language-modal"
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        scrollType="inside"
      >
        <Hidden below="xl">
          <Box display="flex" columnGap={3}>
            <Box className={styles.leftColumn}>
              <Box position="sticky" top={0} left={0}>
                <EmbeddedVideo url={videoUrl} locale={activeLocale} />
              </Box>
            </Box>
            <Box marginTop={[3, 3, 3, 3, 0]} className={styles.rightColumn}>
              {content}
            </Box>
          </Box>
        </Hidden>
        <Hidden above="lg">
          <Box>
            <Box position="sticky" top={0} left={0}>
              <EmbeddedVideo url={videoUrl} locale={activeLocale} />
            </Box>
            <Box marginTop={[3, 3, 3, 3, 0]} className={styles.rightColumn}>
              {content}
            </Box>
          </Box>
        </Hidden>
      </Modal>
      <Button onClick={() => setIsModalVisible(true)}>Sign language</Button>
    </>
  )
}
