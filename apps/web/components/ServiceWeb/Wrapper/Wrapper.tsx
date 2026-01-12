import { createContext, FC, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Box } from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  ServiceWebBackground,
  ServiceWebDynamicFooter,
  ServiceWebHeader,
  ServiceWebSearchSection,
  WatsonChatPanel,
} from '@island.is/web/components'
import {
  GetWebChatQuery,
  Organization,
  QueryGetWebChatArgs,
  ServiceWebPage,
} from '@island.is/web/graphql/schema'
import { usePlausiblePageview } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_WEB_CHAT } from '@island.is/web/screens/queries/WebChat'

import WebChat from '../../WebChat/WebChat'
import config, { watsonConfig } from '../config'
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

  const { data: webChatData } = useQuery<GetWebChatQuery, QueryGetWebChatArgs>(
    GET_WEB_CHAT,
    {
      skip: !organization?.id,
      variables: {
        input: {
          displayLocationIds: [organization?.id],
          lang: activeLocale,
        },
      },
    },
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
          organization={{ ...organization, footerItems }}
          namespace={namespace}
        />
      </ServiceWebContext.Provider>
      <WebChat
        webChat={webChatData?.getWebChat}
        renderFallback={() => {
          if (organization?.id in watsonConfig[activeLocale]) {
            return (
              <WatsonChatPanel
                {...watsonConfig[activeLocale][organization.id]}
              />
            )
          }
          return null
        }}
      />
    </>
  )
}

export default Wrapper
