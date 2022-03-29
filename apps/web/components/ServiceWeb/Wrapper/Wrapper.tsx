import React, { FC, useEffect, useState, createContext } from 'react'
import Head from 'next/head'
import { Box } from '@island.is/island-ui/core'

import { Organization, Tag, Image } from '@island.is/web/graphql/schema'
import {
  ServiceWebSearchSection,
  ServiceWebHeader,
  ServiceWebBackground,
  ServiceWebDynamicFooter,
  HeadWithSocialSharing,
} from '@island.is/web/components'
import { BackgroundVariations, Options, TextModes } from '../types'
import config from '../config'

import * as styles from './Wrapper.css'

const DEFAULT_INSTITUTION_SLUG = 'stafraent-island'

type ServiceWebContextProps = {
  textMode: TextModes
  institutionSlug: BackgroundVariations
}

export const ServiceWebContext = createContext<ServiceWebContextProps>({
  textMode: 'dark',
  institutionSlug: DEFAULT_INSTITUTION_SLUG,
})

interface WrapperProps {
  pageTitle: string
  headerTitle: string
  institutionSlug: BackgroundVariations
  organization: Organization
  logoUrl?: string
  searchTitle?: string
  organizationTitle?: string
  smallBackground?: boolean
  searchPlaceholder?: string
  searchTags?: Tag[]
  showLogoTitle?: boolean
  pageDescription?: string
  pageFeaturedImage?: Image
}

export const Wrapper: FC<WrapperProps> = ({
  pageTitle,
  headerTitle,
  institutionSlug,
  organization,
  logoUrl,
  searchTitle,
  organizationTitle,
  smallBackground,
  searchPlaceholder,
  searchTags,
  showLogoTitle,
  pageDescription,
  pageFeaturedImage,
  children,
}) => {
  const [options, setOptions] = useState<Options>({
    textMode: 'dark',
  })
  const [textMode, setTextMode] = useState<TextModes>('light')
  const showSearchSection = searchTitle && organizationTitle

  useEffect(() => {
    if (institutionSlug in config) {
      setOptions(config[institutionSlug ?? 'default'])
    }
  }, [institutionSlug])

  useEffect(() => {
    setTextMode(options.textMode)
  }, [options])

  return (
    <>
      {!organization.serviceWebFeaturedImage && (
        <Head>
          <title>{pageTitle}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
      {organization.serviceWebFeaturedImage && (
        <HeadWithSocialSharing
          title={pageTitle}
          description={pageDescription}
          imageUrl={pageFeaturedImage?.url}
          imageContentType={pageFeaturedImage?.contentType}
          imageWidth={pageFeaturedImage?.width?.toString()}
          imageHeight={pageFeaturedImage?.height?.toString()}
        >
          <meta name="robots" content="noindex, nofollow" />
        </HeadWithSocialSharing>
      )}
      <ServiceWebContext.Provider value={{ textMode, institutionSlug }}>
        <ServiceWebHeader
          hideSearch={!smallBackground}
          title={headerTitle}
          textMode={textMode}
          searchPlaceholder={searchPlaceholder}
          searchTags={searchTags}
        />
        <ServiceWebBackground
          variation={
            !(institutionSlug as BackgroundVariations)
              ? DEFAULT_INSTITUTION_SLUG
              : institutionSlug
          }
          small={smallBackground}
        />
        {!!showSearchSection && (
          <Box className={styles.searchSection}>
            <ServiceWebSearchSection
              logoTitle={showLogoTitle ? organizationTitle : undefined}
              logoUrl={logoUrl}
              title={searchTitle}
              textMode={textMode}
              searchPlaceholder={searchPlaceholder}
              searchTags={searchTags}
            />
          </Box>
        )}
        {children}
        <ServiceWebDynamicFooter
          institutionSlug={institutionSlug}
          organization={organization}
        />
      </ServiceWebContext.Provider>
    </>
  )
}

export default Wrapper
