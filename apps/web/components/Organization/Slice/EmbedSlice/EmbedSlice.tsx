import { useMemo, useState } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import type { Embed as EmbedSchema } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { EmbedDisclaimer } from '../../../ChatPanel/ChatBubble/EmbedDisclaimer/EmbedDisclaimer'
import * as styles from './EmbedSlice.css'

const calculatePaddingBottom = (aspectRatio: string) => {
  const [width, height] = aspectRatio.split('/')
  return `${(Number(height) / Number(width)) * 100}%`
}

interface EmbedSliceProps {
  slice: EmbedSchema
}

const EMBED_CONSENT_KEY_PREFIX = 'ALLOW_EMBED_DOMAIN_'

const getEmbedHostname = (embedUrl?: string | null) => {
  if (!embedUrl) return null

  try {
    const parsedUrl = new URL(embedUrl, 'https://island.is')
    return parsedUrl.hostname || null
  } catch {
    return null
  }
}

const getEmbedConsentKey = (embedUrl?: string | null) => {
  const hostname = getEmbedHostname(embedUrl)
  const keyScope = hostname ?? 'UNKNOWN'
  const normalizedScope = keyScope.toUpperCase().replace(/[^A-Z0-9]/g, '_')

  return `${EMBED_CONSENT_KEY_PREFIX}${normalizedScope}`
}

const texts = (hostname?: string | null) => {
  const domainSuffix = hostname ? hostname : ''

  return {
    is: {
      message: (
        <Text variant="default">
          Þetta efni{`${domainSuffix ? ` frá ${domainSuffix} ` : ' '}`}er hýst
          af þriðja aðila. Með því að birta efnið samþykkir þú skilmála þeirra.
        </Text>
      ),
      remember: 'Muna þessa stillingu.',
      accept: 'Birta',
      cancel: 'Hætta við',
      open: 'Sýna innfellt efni',
    },
    en: {
      message: (
        <Text variant="default">
          This content{domainSuffix} is hosted by a third party. By viewing it
          you accept their terms and conditions.
        </Text>
      ),
      remember: 'Remember this choice.',
      accept: 'View',
      cancel: 'Cancel',
      open: 'Show embedded content',
    },
  }
}

export const EmbedSlice = ({ slice }: EmbedSliceProps) => {
  const { activeLocale } = useI18n()
  const [allowed, setAllowed] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const consentKey = useMemo(
    () => getEmbedConsentKey(slice.embedUrl),
    [slice.embedUrl],
  )
  const hostname = useMemo(
    () => getEmbedHostname(slice.embedUrl),
    [slice.embedUrl],
  )

  const copy = texts(hostname)
  const localizedTexts = copy[activeLocale] ?? copy.is

  const showEmbed = () => {
    try {
      const rememberedConsent = localStorage.getItem(consentKey)
      if (rememberedConsent === 'true') {
        setAllowed(true)
        setShowDisclaimer(false)
        return
      }
    } catch (error) {
      console.warn('Failed to get embed preference:', error)
    }

    setShowDisclaimer(true)
  }

  if (!slice.embedUrl) {
    return null
  }

  return (
    <Box
      className={styles.container}
      style={{
        paddingBottom: calculatePaddingBottom(slice.aspectRatio ?? '16/9'),
      }}
    >
      {!allowed && (
        <Box className={styles.placeholder} background="blue100">
          {showDisclaimer ? (
            <Box className={styles.disclaimer}>
              <EmbedDisclaimer
                variant="inline"
                localStorageKey={consentKey}
                onAnswer={(acceptsTerms) => {
                  setShowDisclaimer(false)
                  if (acceptsTerms) {
                    setAllowed(true)
                  }
                }}
                texts={{
                  message: localizedTexts.message,
                  remember: localizedTexts.remember,
                  accept: localizedTexts.accept,
                  cancel: localizedTexts.cancel,
                }}
              />
            </Box>
          ) : (
            <Button onClick={showEmbed} size="small">
              {localizedTexts.open}
            </Button>
          )}
        </Box>
      )}
      {allowed && (
        <iframe
          className={styles.responsiveIframe}
          src={slice.embedUrl}
          title={slice.altText ?? ''}
          allowFullScreen={true}
        />
      )}
    </Box>
  )
}
