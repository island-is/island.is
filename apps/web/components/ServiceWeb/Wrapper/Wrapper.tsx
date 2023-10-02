import { FC, useEffect, useState, createContext, useMemo } from 'react'
import { Box } from '@island.is/island-ui/core'
import { Organization } from '@island.is/web/graphql/schema'
import {
  ServiceWebSearchSection,
  ServiceWebHeader,
  ServiceWebBackground,
  ServiceWebDynamicFooter,
  HeadWithSocialSharing,
  WatsonChatPanel,
} from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { usePlausiblePageview } from '@island.is/web/hooks'
import { BackgroundVariations, Options, TextModes } from '../types'
import config, { watsonConfig } from '../config'

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
    () => JSON.parse(organization?.namespace?.fields ?? '{}'),
    [],
  )

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
          organization={organization}
          namespace={namespace}
        />
      </ServiceWebContext.Provider>
      {organization?.id in watsonConfig[activeLocale] && (
        <WatsonChatPanel {...watsonConfig[activeLocale][organization.id]} />
      )}
    </>
  )
}

export default Wrapper
