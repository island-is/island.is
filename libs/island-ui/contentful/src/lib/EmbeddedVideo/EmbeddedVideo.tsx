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

import * as styles from './EmbeddedVideo.css'

export interface EmbeddedVideoProps {
  title?: string
  url: string
  locale?: string
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
    const item = new URL(url)

    if (item.hostname.match(/(vimeo.com)/g)) {
      const match = /vimeo.*\/(\d+)/i.exec(item.href)

      if (match) {
        setEmbedUrl(`https://player.vimeo.com/video/${match[1]}`)
        setTermsUrl(`https://vimeo.com/terms`)
        setType('VIMEO')
      }
    }

    if (item.hostname.match(/(youtube.com|youtu.be)/g)) {
      const regExp =
        /^.*((youtu.be|youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      const match = item.href.match(regExp)

      let youtubeId: string | undefined = undefined

      if (match) {
        let id = match[7]
        if (id.startsWith('/')) id = id.slice(1)
        if (id.length === 11) youtubeId = id
      }

      if (youtubeId) {
        setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}`)
        setTermsUrl(`https://www.youtube.com/t/terms`)
        setType('YOUTUBE')
      }
    }
  }, [])

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
    // TODO: refactor
    if (itemKey) {
      const itemValue = localStorage.getItem(itemKey)
      if (itemValue === 'true') {
        setShowDisclaimer(false)
        setAllowed(true)
      } else {
        setShowDisclaimer(
          (isDisclaimerBeingShown) => isDisclaimerBeingShown || !allowed,
        )
      }
    } else {
      setShowDisclaimer(
        (isDisclaimerBeingShown) => isDisclaimerBeingShown || !allowed,
      )
    }
  }

  return (
    <Box className={styles.container}>
      {showDisclaimer && (
        <Box className={cn(styles.content, styles.modal)}>
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
            <Stack space={3}>
              <Box>{texts.message}</Box>
              <Box>
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
                        localStorage.setItem(itemKey, 'true')
                      }}
                    />
                  )}
                />
              </Box>
              <Box>
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
              </Box>
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
            style={{
              backgroundImage:
                'url(http://i3.ytimg.com/vi/SUetxOg9gWI/hqdefault.jpg)',
              width: '100%',
              height: '100%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
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
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
          className={styles.content}
        />
      )}
    </Box>
  )
}

export default EmbeddedVideo
