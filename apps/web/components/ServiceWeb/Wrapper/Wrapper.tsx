import { createContext, FC, useEffect, useMemo, useState } from 'react'

import { Box } from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  ServiceWebBackground,
  ServiceWebDynamicFooter,
  ServiceWebHeader,
  ServiceWebSearchSection,
  WatsonChatPanel,
  ZendeskChatPanel,
} from '@island.is/web/components'
import { Organization, ServiceWebPage } from '@island.is/web/graphql/schema'
import { usePlausiblePageview } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import config, { watsonConfig, zendeskConfig } from '../config'
import { BackgroundVariations, Options, TextModes } from '../types'
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
  showLogoTitle?: boolean
  pageDescription?: string
  indexableBySearchEngine?: boolean
  showLogoOnMobileDisplays?: boolean
  pageData?: ServiceWebPage | null
}

export const Wrapper: FC<React.PropsWithChildren<WrapperProps>> = ({
  pageTitle,
  headerTitle,
  institutionSlug,
  organization,
  logoUrl,
  searchTitle,
  organizationTitle,
  smallBackground,
  searchPlaceholder,
  showLogoTitle,
  pageDescription,
  indexableBySearchEngine = false,
  showLogoOnMobileDisplays,
  pageData,
  children,
}) => {
  const { activeLocale } = useI18n()
  const [options, setOptions] = useState<Options>({
    textMode: 'dark',
  })
  const [textMode, setTextMode] = useState<TextModes>('light')
  const showSearchSection = searchTitle && organizationTitle
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  usePlausiblePageview(organization?.trackingDomain)

  useEffect(() => {
    if (institutionSlug in config) {
      setOptions(config[institutionSlug ?? 'default'])
    }
  }, [institutionSlug])

  useEffect(() => {
    setTextMode(options.textMode)
  }, [options])

  const namespace = useMemo(
    () => JSON.parse(organization?.namespace?.fields || '{}'),
    [],
  )

  // Override the footer items in case the page has some
  const footerItems =
    typeof pageData?.footerItems?.length === 'number' &&
    pageData.footerItems.length > 0
      ? pageData.footerItems
      : organization?.footerItems ?? []

  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={organization?.serviceWebFeaturedImage?.url}
        imageContentType={organization?.serviceWebFeaturedImage?.contentType}
        imageWidth={organization?.serviceWebFeaturedImage?.width?.toString()}
        imageHeight={organization?.serviceWebFeaturedImage?.height?.toString()}
      >
        {!indexableBySearchEngine && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>

      <ServiceWebContext.Provider value={{ textMode, institutionSlug }}>
        <ServiceWebHeader
          hideSearch={!smallBackground}
          title={headerTitle}
          textMode={textMode}
          searchPlaceholder={searchPlaceholder}
          namespace={namespace}
        />
        <ServiceWebBackground
          variation={
            !(institutionSlug as BackgroundVariations)
              ? DEFAULT_INSTITUTION_SLUG
              : institutionSlug
          }
          namespace={namespace}
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
              namespace={namespace}
              showLogoOnMobileDisplays={showLogoOnMobileDisplays}
            />
          </Box>
        )}
        {children}
        <ServiceWebDynamicFooter
          institutionSlug={institutionSlug}
          organization={{ ...organization, footerItems }}
          namespace={namespace}
        />
      </ServiceWebContext.Provider>
      {organization?.id in zendeskConfig[activeLocale] && (
        <ZendeskChatPanel {...zendeskConfig[activeLocale][organization.id]} />
      )}
      {organization?.id in watsonConfig[activeLocale] && (
        <WatsonChatPanel {...watsonConfig[activeLocale][organization.id]} />
      )}
    </>
  )
}

export default Wrapper
