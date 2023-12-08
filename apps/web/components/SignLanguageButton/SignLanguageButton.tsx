import { ReactNode, useMemo, useState } from 'react'
import type { Locale } from 'locale'
import { useQuery } from '@apollo/client'

import { EmbeddedVideo } from '@island.is/island-ui/contentful'
import { Box, Hidden, Icon, Text } from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'
import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import * as styles from './SignLanguageButton.css'

const DEFAULT_BUTTON_TEXT: Record<Locale, string> = {
  is: 'Táknmál',
  en: 'Sign language',
}

interface SignLanguageButtonProps {
  videoUrl: string
  videoThumbnailImageUrl?: string
  content: ReactNode
}

export const SignLanguageButton = ({
  videoUrl,
  videoThumbnailImageUrl,
  content,
}: SignLanguageButtonProps) => {
  const { activeLocale } = useI18n()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { data, loading } = useQuery<Query, QueryGetNamespaceArgs>(
    GET_NAMESPACE_QUERY,
    {
      variables: {
        input: {
          lang: activeLocale,
          namespace: 'Global',
        },
      },
    },
  )

  const namespace = useMemo(
    () => JSON.parse(data?.getNamespace?.fields ?? '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespace(namespace)

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
        <Hidden below="lg">
          <Box display="flex" columnGap={3}>
            <Box className={styles.leftColumn}>
              <Box position="sticky" top={0} left={0}>
                <EmbeddedVideo
                  url={videoUrl}
                  locale={activeLocale}
                  thumbnailImageUrl={videoThumbnailImageUrl}
                />
              </Box>
            </Box>
            <Box className={styles.rightColumn}>{content}</Box>
          </Box>
        </Hidden>
        <Hidden above="md">
          <Box>
            <Box
              position="sticky"
              top={0}
              left={0}
              className={styles.leftColumn}
            >
              <EmbeddedVideo url={videoUrl} locale={activeLocale} />
            </Box>
            <Box marginTop={3} className={styles.rightColumn}>
              {content}
            </Box>
          </Box>
        </Hidden>
      </Modal>

      {!loading && (
        <Box marginBottom={1}>
          <Box
            cursor="pointer"
            display="flex"
            flexWrap="nowrap"
            columnGap={1}
            borderBottomWidth={isModalVisible ? 'large' : undefined}
            borderColor={isModalVisible ? 'mint400' : undefined}
            onClick={() => setIsModalVisible(true)}
          >
            <Icon icon="signLanguage" />
            <Text
              color={isModalVisible ? 'blueberry400' : undefined}
              fontWeight="semiBold"
            >
              {n('signLanguage', DEFAULT_BUTTON_TEXT[activeLocale || 'is'])}
            </Text>
          </Box>
        </Box>
      )}
    </>
  )
}
