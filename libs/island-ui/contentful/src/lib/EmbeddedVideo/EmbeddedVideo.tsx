import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import cn from 'classnames'

import {
  Button,
  Box,
  Stack,
  Text,
  LinkContext,
  Checkbox,
  Icon,
  FocusableBox,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getVideoEmbedProperties } from '@island.is/shared/utils'

import * as styles from './EmbeddedVideo.css'

export interface EmbeddedVideoProps {
  title?: string
  url: string
  locale?: string
  thumbnailImageUrl?: string
}

const Texts = ({ termsUrl = '#' }) => ({
  is: {
    message: (
      <Text variant="default">
        Þetta efni er hýst af þriðja aðila. Með því að birta efnið samþykkir þú
        {` `}
        <a href={termsUrl}>skilmála</a> þeirra.
      </Text>
    ),
    remember: `Muna þessa stillingu.`,
    view: `Birta`,
    cancel: 'Hætta við',
  },
  en: {
    message: (
      <Text variant="intro">
        This content is hosted by a third party. By viewing it you accept their
        {` `}
        <a href={termsUrl}>terms and conditions</a>.
      </Text>
    ),
    remember: `Remember this choice.`,
    view: `View`,
    cancel: 'Cancel',
  },
})

export const EmbeddedVideo: FC<EmbeddedVideoProps> = ({
  title,
  url,
  locale,
  thumbnailImageUrl,
}) => {
  const [allowed, setAllowed] = useState<boolean>(false)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false)
  const [termsUrl, setTermsUrl] = useState<string>(null)
  const [itemKey, setItemKey] = useState<string>('')
  const [type, setType] = useState<'YOUTUBE' | 'VIMEO' | ''>('')
  const methods = useForm()

  const { control } = methods

  useEffect(() => {
    const embedProperties = getVideoEmbedProperties(url)
    if (!embedProperties) return
    setEmbedUrl(embedProperties.embedUrl)
    setTermsUrl(embedProperties.termsUrl)
    setType(embedProperties.type)
  }, [url])

  useEffect(() => {
    if (type) {
      setItemKey(`ALLOW_EMBEDDED_VIDEO_${type}`)
    }
  }, [type])

  if (!embedUrl) {
    return null
  }

  const TextsData = Texts({ termsUrl })

  const texts: typeof TextsData[keyof typeof TextsData] =
    Object.prototype.hasOwnProperty.call(TextsData, locale)
      ? TextsData[locale]
      : TextsData['is']

  const onPlayButtonClick = () => {
    if (itemKey) {
      const itemValue = localStorage.getItem(itemKey)
      if (itemValue === 'true') {
        setShowDisclaimer(false)
        setAllowed(true)
        return
      }
    }
    setShowDisclaimer(
      (isDisclaimerBeingShown) => isDisclaimerBeingShown || !allowed,
    )
  }

  return (
    <Box className={styles.container}>
      {showDisclaimer && (
        <Box className={styles.modal} background="blue100" borderRadius="large">
          <FocusableBox
            tabIndex={0}
            className={styles.closeButton}
            aria-label={texts.cancel}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                setShowDisclaimer(false)
                ev.preventDefault()
              }
            }}
            onClick={() => {
              setShowDisclaimer(false)
            }}
          >
            <Icon icon="close" size="medium" />
          </FocusableBox>
          <LinkContext.Provider
            value={{
              linkRenderer: (href, children) => (
                <a
                  className={styles.link}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              ),
            }}
          >
            <Stack space={3} align="center">
              <Box>{texts.message}</Box>

              <Controller
                name="contentAllowed"
                defaultValue={false}
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    label={texts.remember}
                    checked={value}
                    onChange={(e) => {
                      onChange(e.target.checked)
                      localStorage.setItem(
                        itemKey,
                        e.target.checked ? 'true' : 'false',
                      )
                    }}
                  />
                )}
              />

              <Button
                colorScheme="default"
                size="small"
                onClick={() => {
                  setShowDisclaimer(false)
                  setAllowed(true)
                }}
              >
                {texts.view}
              </Button>

              <Box>
                <Button
                  variant="ghost"
                  colorScheme="default"
                  size="small"
                  onClick={() => {
                    setShowDisclaimer(false)
                  }}
                >
                  {texts.cancel}
                </Button>
              </Box>
            </Stack>
          </LinkContext.Provider>
        </Box>
      )}
      {!allowed && (
        <Box className={styles.content}>
          <Box
            position="relative"
            className={styles.innerContent}
            style={{
              backgroundColor: thumbnailImageUrl
                ? 'transparent'
                : theme.color.blue100,
              backgroundImage: thumbnailImageUrl
                ? `url(${thumbnailImageUrl})`
                : '',
            }}
          >
            {!thumbnailImageUrl && (
              <Box padding="p2">
                <Text>{title}</Text>
              </Box>
            )}
            <FocusableBox
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  onPlayButtonClick()
                  ev.preventDefault()
                }
              }}
              onClick={onPlayButtonClick}
              className={styles.playIconContainer}
              as="button"
            >
              <Icon size="large" icon="playCircle" color="white" />
            </FocusableBox>
          </Box>
        </Box>
      )}
      {allowed && (
        <iframe
          title={title}
          src={embedUrl}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; autoplay"
          frameBorder="0"
          allowFullScreen
          className={styles.content}
        />
      )}
    </Box>
  )
}

export default EmbeddedVideo
