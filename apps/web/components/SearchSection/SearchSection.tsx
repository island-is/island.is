import React, { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import dynamic from 'next/dynamic'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Stack,
  Inline,
  Tag,
  Link,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { SearchInput } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GetFrontpageQuery } from '@island.is/web/graphql/schema'

import * as styles from './SearchSection.css'

const DefaultIllustration = dynamic(() => import('./Illustration'), {
  ssr: false,
})

type SearchSectionProps = {
  page: GetFrontpageQuery['getFrontpage']
  headingId: string
  activeLocale: Locale
  quickContentLabel: string
  placeholder: string
  browserVideoUnsupported: string
}

export const SearchSection = ({
  headingId,
  activeLocale,
  quickContentLabel = '',
  placeholder = '',
  page,
}: SearchSectionProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const { linkResolver } = useLinkResolver()

  const {
    featured,
    heading,
    image,
    imageAlternativeText,
    imageMobile,
    videos,
    videosMobile,
  } = page

  useEffect(() => {
    const shouldBeMobile = width < theme.breakpoints.md

    if (shouldBeMobile !== isMobile) {
      setIsMobile(shouldBeMobile)
    }
  }, [width, isMobile])

  return (
    <>
      <GridContainer>
        <GridRow
          marginTop={4}
          marginBottom={[0, 0, 4]}
          className={styles.minHeight}
        >
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <Box display="flex" height="full" alignItems="center">
              <Stack space={[3, 3, 5]}>
                <Text as="h1" variant="h1" id={headingId}>
                  {heading ?? ''}
                </Text>
                <SearchInput
                  id="search_input_home"
                  size="large"
                  activeLocale={activeLocale}
                  quickContentLabel={quickContentLabel}
                  placeholder={placeholder}
                  openOnFocus
                  colored
                />
                <Inline space={2}>
                  {featured.map(({ title, attention, thing }) => {
                    const cardUrl = linkResolver(thing?.type as LinkType, [
                      thing?.slug,
                    ])
                    return cardUrl?.href && cardUrl?.href.length > 0 ? (
                      <Tag
                        key={title}
                        {...(cardUrl.href.startsWith('/')
                          ? {
                              CustomLink: ({ children, ...props }) => (
                                <Link
                                  key={title}
                                  {...props}
                                  {...cardUrl}
                                  dataTestId="featured-link"
                                >
                                  {children}
                                </Link>
                              ),
                            }
                          : { href: cardUrl.href })}
                        variant="blue"
                        attention={attention}
                      >
                        {title}
                      </Tag>
                    ) : (
                      <Tag key={title} variant="blue" attention={attention}>
                        {title}
                      </Tag>
                    )
                  })}
                </Inline>
              </Stack>
            </Box>
          </GridColumn>
          <GridColumn
            hiddenBelow="md"
            offset={['0', '0', '0', '1/12']}
            span={['0', '0', '6/12', '5/12']}
          >
            {isMobile === false && (
              <Box
                display="flex"
                width="full"
                height="full"
                justifyContent="center"
                alignItems="center"
                aria-hidden="true"
              >
                {videos?.length ? (
                  <Video
                    name="desktop"
                    title={imageAlternativeText}
                    sources={videos.map(({ url, contentType }) => {
                      return {
                        src: url,
                        type: contentType,
                      }
                    })}
                    fallback={
                      <ImageOrDefault
                        url={image?.url}
                        imageAlternativeText={imageAlternativeText}
                      />
                    }
                  />
                ) : (
                  <ImageOrDefault
                    url={image?.url}
                    imageAlternativeText={imageAlternativeText}
                  />
                )}
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
      {isMobile === true && (
        <Box
          display="flex"
          width="full"
          height="full"
          justifyContent="center"
          alignItems="center"
          aria-hidden="true"
          paddingTop={[4, 4, 0]}
        >
          {videosMobile?.length ? (
            <Video
              name="mobile"
              title={imageAlternativeText}
              sources={videosMobile.map(({ url, contentType }) => {
                return {
                  src: url,
                  type: contentType,
                }
              })}
              fallback={
                <ImageOrDefault
                  url={imageMobile?.url}
                  imageAlternativeText={imageAlternativeText}
                  isMobile={isMobile}
                />
              }
            />
          ) : (
            <ImageOrDefault
              url={imageMobile?.url}
              imageAlternativeText={imageAlternativeText}
              isMobile={isMobile}
            />
          )}
        </Box>
      )}
    </>
  )
}

type SourceProps = {
  src: string
  type: string
}

type VideoProps = {
  name: string
  title: string
  sources: SourceProps[]
  fallback: ReactNode
}

const Video = ({ name, title, sources, fallback }: VideoProps) => {
  const id = `front_page_video_${name}`

  return (
    <video
      key={id}
      id={id}
      title={title}
      className={styles.mediaItem}
      autoPlay
      loop
      muted
      playsInline
    >
      {sources.map(({ src, type }, index) => (
        <source key={`${id}_source_${index}`} src={src} type={type} />
      ))}
      {fallback}
    </video>
  )
}

type ImageProps = {
  spacing?: boolean
  src: string
  alt: string
}

const Image = ({ spacing, src, alt }: ImageProps) => {
  return (
    <Box marginY={spacing ? 2 : 0} display="flex" width="full" height="full">
      <img src={src} alt={alt} className={styles.mediaItem} />
    </Box>
  )
}

type ImageOrDefaultProps = {
  url?: string
  imageAlternativeText: string
  isMobile?: boolean | null
}

const ImageOrDefault = ({
  url,
  imageAlternativeText,
  isMobile,
}: ImageOrDefaultProps) => {
  if (url) {
    return <Image src={url} alt={imageAlternativeText} spacing={isMobile} />
  }

  return <DefaultIllustration className={styles.defaultIllustration} />
}

export default SearchSection
