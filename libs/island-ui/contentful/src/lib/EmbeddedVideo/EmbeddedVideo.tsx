import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Box,
  Stack,
  Text,
  LinkContext,
  Checkbox,
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
      <Text variant="intro">
        Þetta efni er hýst af þriðja aðila. Með því að birta efnið samþykkir þú
        {` `}
        <a href={termsUrl}>skilmála</a> þeirra.
      </Text>
    ),
    remember: `Muna þessa stillingu.`,
    view: `Birta`,
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
  },
})

export const EmbeddedVideo: FC<EmbeddedVideoProps> = ({
  title,
  url,
  locale,
}) => {
  const [allowed, setAllowed] = useState<boolean>(false)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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

  useEffect(() => {
    if (itemKey) {
      const itemValue = localStorage.getItem(itemKey)
      if (itemValue === 'true') {
        setAllowed(true)
      }
    }
  }, [itemKey])

  if (!embedUrl) {
    return null
  }

  const textSettings = { termsUrl }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const TextsData = Texts(textSettings)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const texts = Object.prototype.hasOwnProperty.call(TextsData, locale)
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      TextsData[locale]
    : TextsData['is']

  return (
    <>
      {allowed && (
        <Box className={styles.container}>
          <iframe
            title={title}
            src={embedUrl}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
            className={styles.content}
          ></iframe>
        </Box>
      )}
      {!allowed && (
        <Box
          borderRadius="large"
          paddingY={4}
          paddingX={[3, 3, 3, 3, 4]}
          display="inlineFlex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          background="blue100"
        >
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
                <Button
                  onClick={() => setAllowed(true)}
                  iconType="filled"
                  icon="playCircle"
                >
                  {texts.view}
                </Button>
              </Box>
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
            </Stack>
          </LinkContext.Provider>
        </Box>
      )}
    </>
  )
}

export default EmbeddedVideo
