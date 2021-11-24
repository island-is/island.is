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
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  const defaultIllustration = (
    <DefaultIllustration className={styles.defaultIllustration} />
  )

  const mobileImage = image?.url ? (
    <Image src={image?.url} alt={imageAlternativeText} spacing={isMobile} />
  ) : (
    defaultIllustration
  )

  const desktopImage = imageMobile?.url ? (
    <Image
      src={imageMobile?.url}
      alt={imageAlternativeText}
      spacing={isMobile}
    />
  ) : (
    defaultIllustration
  )

  return (
    <GridContainer>
      <GridRow marginTop={4} marginBottom={[0, 0, 4]}>
        <GridColumn span={['12/12', '12/12', '7/12', '6/12']}>
          <Box display="flex" height="full" alignItems="center">
            <Stack space={[3, 3, 5]}>
              <Text variant="h1" id={headingId}>
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
                              <Link key={title} {...props} {...cardUrl}>
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
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '5/12', '4/12']}
        >
          {isMobile !== null && (
            <Box
              display="flex"
              width="full"
              height="full"
              justifyContent="center"
              alignItems="center"
              aria-hidden="true"
            >
              {isMobile &&
                (videosMobile?.length ? (
                  <Video
                    name="mobile"
                    title={imageAlternativeText}
                    sources={videosMobile.map(({ url, contentType }) => {
                      return {
                        src: url,
                        type: contentType,
                      }
                    })}
                    fallback={desktopImage}
                  />
                ) : (
                  desktopImage
                ))}

              {!isMobile &&
                (videos?.length ? (
                  <Video
                    name="desktop"
                    title={imageAlternativeText}
                    sources={videos.map(({ url, contentType }) => {
                      return {
                        src: url,
                        type: contentType,
                      }
                    })}
                    fallback={mobileImage}
                  />
                ) : (
                  mobileImage
                ))}
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
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
    <video key={id} id={id} width="100%" title={title} autoPlay loop muted>
      {sources.map(({ src, type }, index) => (
        <source key={`${id}_source_${index}`} src={src} type={type} />
      ))}
      {fallback}
    </video>
  )
}

type ImageProps = {
  spacing: boolean
  src: string
  alt: string
}

const Image = ({ spacing, src, alt }: ImageProps) => {
  return (
    <Box marginY={spacing ? 2 : 0} display="flex" width="full" height="full">
      <img src={src} alt={alt} className={styles.image} />
    </Box>
  )
}

export default SearchSection
