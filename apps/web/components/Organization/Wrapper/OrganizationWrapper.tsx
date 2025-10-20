import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IntlConfig, IntlProvider } from 'react-intl'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Link,
  LinkV2,
  Navigation,
  NavigationItem,
  ProfileCard,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { shouldLinkBeAnAnchorTag } from '@island.is/shared/utils'
import {
  BoostChatPanel,
  boostChatPanelEndpoints,
  DefaultHeaderProps,
  Footer as WebFooter,
  HeadWithSocialSharing,
  LiveChatIncChatPanel,
  OrganizationSearchInput,
  SearchBox,
  SidebarShipSearchInput,
  Sticky,
  Webreader,
} from '@island.is/web/components'
import { DefaultHeader, WatsonChatPanel } from '@island.is/web/components'
import {
  SLICE_SPACING,
  STICKY_NAV_MAX_WIDTH_LG,
} from '@island.is/web/constants'
import { GlobalContext } from '@island.is/web/context'
import {
  Image,
  Organization,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import {
  useLinkResolver,
  useNamespace,
  usePlausiblePageview,
} from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getBackgroundStyle } from '@island.is/web/utils/organization'

import { LatestNewsCardConnectedComponent } from '../LatestNewsCardConnectedComponent'
import { DigitalIcelandFooter } from './Themes/DigitalIcelandTheme/DigitalIcelandFooter'
import { FiskistofaDefaultHeader } from './Themes/FiskistofaTheme'
import { FiskistofaFooter } from './Themes/FiskistofaTheme'
import { GevFooter } from './Themes/GevTheme'
import { HeilbrigdisstofnunAusturlandsFooter } from './Themes/HeilbrigdisstofnunAusturlandsTheme'
import { HeilbrigdisstofnunNordurlandsFooter } from './Themes/HeilbrigdisstofnunNordurlandsTheme'
import { HeilbrigdisstofnunSudurlandsFooter } from './Themes/HeilbrigdisstofnunSudurlandsTheme'
import { HljodbokasafnIslandsHeader } from './Themes/HljodbokasafnIslandsTheme'
import { HveFooter } from './Themes/HveTheme'
import { IcelandicNaturalDisasterInsuranceFooter } from './Themes/IcelandicNaturalDisasterInsuranceTheme'
import { LandskjorstjornFooter } from './Themes/LandkjorstjornTheme'
import { LandlaeknirFooter } from './Themes/LandlaeknirTheme'
import { MannaudstorgFooter } from './Themes/MannaudstorgTheme'
import { RikislogmadurFooter } from './Themes/RikislogmadurTheme'
import { SAkFooter } from './Themes/SAkTheme'
import { ShhFooter } from './Themes/SHHTheme'
import {
  SjukratryggingarDefaultHeader,
  SjukratryggingarFooter,
} from './Themes/SjukratryggingarTheme'
import {
  SyslumennDefaultHeader,
  SyslumennFooter,
} from './Themes/SyslumennTheme'
import { UniversityStudiesHeader } from './Themes/UniversityStudiesTheme'
import UniversityStudiesFooter from './Themes/UniversityStudiesTheme/UniversityStudiesFooter'
import { UtlendingastofnunFooter } from './Themes/UtlendingastofnunTheme'
import { VinnueftilitidHeader } from './Themes/VinnueftirlitidTheme'
import { liveChatIncConfig, watsonConfig } from './config'
import * as styles from './OrganizationWrapper.css'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image | null
  organizationPage: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  stickySidebar?: boolean
  minimal?: boolean
  showSecondaryMenu?: boolean
  showExternalLinks?: boolean
  showReadSpeaker?: boolean
  isSubpage?: boolean
  backLink?: { text: string; url: string }
}

interface HeaderProps {
  organizationPage: OrganizationPage
  isSubpage?: boolean
}

const darkThemes = ['hms']

const blueberryThemes = ['sjukratryggingar', 'rikislogmadur', 'nti']

const lightThemes = [
  'digital_iceland',
  'default',
  'fiskistofa',
  'landing_page',
  'tryggingastofnun',
  'hve',
  'hsa',
  'haskolanam',
  'nti',
  'samgongustofa',
  'rettindagaesla-fatlads-folks',
  'vinnueftirlitid',
  'hljodbokasafn-islands',
]

export const getThemeConfig = (
  theme?: string,
  organization?: Organization | null,
): { themeConfig: Partial<LayoutProps> } => {
  const organizationNamespace = JSON.parse(
    organization?.namespace?.fields || '{}',
  )

  const usingDefaultHeader: boolean =
    organizationNamespace['usingDefaultHeader'] ?? false

  const footerVersion: LayoutProps['footerVersion'] = 'organization'

  if (lightThemes.includes(theme ?? '') || usingDefaultHeader) {
    return { themeConfig: { footerVersion } }
  }

  if (blueberryThemes.includes(theme ?? ''))
    return {
      themeConfig: {
        headerButtonColorScheme: 'blueberry',
        headerColorScheme: 'blueberry',
        footerVersion,
      },
    }
  if (darkThemes.includes(theme ?? '')) {
    return {
      themeConfig: {
        headerColorScheme: 'dark',
        headerButtonColorScheme: 'dark',
        footerVersion,
      },
    }
  }

  return { themeConfig: { footerVersion } }
}

export const OrganizationHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, isSubpage = false }) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage?.organization?.namespace?.fields || '{}'),
    [organizationPage?.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  const organizationLogoAltText = n(
    'organizationLogoAltText',
    activeLocale === 'is'
      ? organizationPage.organization?.title + ' Forsíða'
      : organizationPage.organization?.title + ' Frontpage',
  )

  const organizationLogoAltTextFallback =
    activeLocale === 'is' ? 'Forsíða stofnunar' : 'Organization frontpage'

  const logoAltText = organizationPage.organization?.title
    ? organizationLogoAltText
    : organizationLogoAltTextFallback

  const defaultProps: DefaultHeaderProps = {
    fullWidth: organizationPage.themeProperties.fullWidth ?? false,
    image: organizationPage.defaultHeaderImage?.url,
    background: getBackgroundStyle(organizationPage.themeProperties),
    title: organizationPage.title,
    logo: organizationPage.organization?.logo?.url,
    logoHref: linkResolver('organizationpage', [organizationPage.slug]).href,
    titleColor:
      (organizationPage.themeProperties
        .textColor as DefaultHeaderProps['titleColor']) || 'dark400',
    imagePadding: organizationPage.themeProperties.imagePadding || '20px',
    imageIsFullHeight:
      organizationPage.themeProperties.imageIsFullHeight ?? true,
    imageObjectFit:
      organizationPage.themeProperties.imageObjectFit === 'cover'
        ? 'cover'
        : 'contain',
    imageObjectPosition:
      organizationPage.themeProperties.imageObjectPosition === 'left'
        ? 'left'
        : organizationPage.themeProperties.imageObjectPosition === 'right'
        ? 'right'
        : 'center',
    logoAltText: logoAltText,
    titleSectionPaddingLeft: organizationPage.themeProperties
      .titleSectionPaddingLeft as ResponsiveSpace,
    mobileBackground: organizationPage.themeProperties.mobileBackgroundColor,
    isSubpage,
  }

  switch (organizationPage.theme) {
    case 'syslumenn':
      return (
        <SyslumennDefaultHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
          isSubpage={isSubpage}
        />
      )
    case 'sjukratryggingar':
      return (
        <SjukratryggingarDefaultHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
          isSubpage={isSubpage}
        />
      )
    case 'digital_iceland':
      return (
        <DefaultHeader
          {...defaultProps}
          titleClassName={styles.digitalIcelandHeaderTitle}
        />
      )
    case 'hsn':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'hsnHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/4v20729OMrRYkktuaCTWRi/675807c8c848895833c4a6a162f2813a/hsn-header-icon.svg',
          )}
        />
      )
    case 'hsu':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'hsuHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/sSSuQeq3oIx9hOrKRvfzm/447c7e6811c3fa9e9d548ecd4b6d7985/vector-myndir-hsu.svg',
          )}
        />
      )
    case 'landlaeknir':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'landlaeknirHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/2p6UWMBdVkVHBAjsnX20bY/c04b402332dbae96c198db7b8640f20b/Header_illustration_1.svg',
          )}
          className={
            isSubpage
              ? styles.landlaeknirHeaderGridContainerSubpage
              : styles.landlaeknirHeaderGridContainer
          }
        />
      )
    case 'fiskistofa':
      return (
        <FiskistofaDefaultHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
          isSubpage={isSubpage}
        />
      )
    case 'rikislogmadur':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.rikislogmadurHeaderGridContainerWidthSubpage
              : styles.rikislogmadurHeaderGridContainerWidth
          }
        />
      )
    case 'landskjorstjorn':
      return <DefaultHeader {...defaultProps} />
    case 'landing_page':
      return null
    case 'fjarsysla-rikisins':
      return <DefaultHeader {...defaultProps} />
    case 'sak':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.sakHeaderGridContainerSubpage
              : styles.sakHeaderGridContainer
          }
          image={n(
            `sakHeaderBgImage`,
            'https://images.ctfassets.net/8k0h54kbe6bj/4SjqwRBZRMWVWG0y73sXxq/cf8d0d16704cfea124362eca03afdb41/sak-header-trans_2x.png',
          )}
          titleSectionPaddingLeft={isSubpage ? 0 : 10}
        />
      )
    case 'gev':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'gevHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/13E4vIA69gDNF87pkHwJgc/c2175b5ce58e50c93ddef5ea26854740/figura.png',
          )}
        />
      )
    case 'hve':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.hveHeaderGridContainerSubpage
              : styles.hveHeaderGridContainer
          }
          image={n(
            'hveHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/7ie5X2T4g8a7g5PLvu5226/4ec8b2cb69b5cb7193a61c562f9b36e0/minstur1.png',
          )}
        />
      )
    case 'shh':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.shhHeaderGridContainerWidthSubpage
              : styles.shhHeaderGridContainerWidth
          }
          titleSectionPaddingLeft={isSubpage ? 0 : 5}
        />
      )
    case 'hsa':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.hsaHeaderGridContainerWidthSubpage
              : styles.hsaHeaderGridContainerWidth
          }
        />
      )
    case 'haskolanam':
      return (
        <UniversityStudiesHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
        />
      )
    case 'nti':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'icelandicNaturalDisasterInsuranceHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/eXqcbclteE88H5iQ6J3lo/bbc1d0c9d3abee93d34ec0aa718c833b/Group__1_.svg',
          )}
        />
      )

    case 'samgongustofa':
      return <DefaultHeader {...defaultProps} />
    case 'geislavarnir-rikisins':
      return (
        <DefaultHeader
          {...defaultProps}
          background="linear-gradient(96.23deg, rgba(1, 54, 65, 0.8) 0.85%, rgba(19, 101, 103, 0.93) 16.4%, rgba(19, 101, 103, 0.885709) 32.16%, rgba(1, 73, 87, 0.88) 56.43%, rgba(2, 69, 91, 0.98) 78.47%, rgba(1, 52, 62, 0.96) 100.8%)"
          image={n(
            'geislavarnirRikisinsHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/5KjaMY9IIB0aX0GOUU60H7/176b6ed26dc01fe4e2559ba2957e85b7/skjaldamerki-transparent.svg',
          )}
        />
      )
    case 'rettindagaesla-fatlads-folks':
      return <DefaultHeader {...defaultProps} />
    case 'hms':
      return (
        <DefaultHeader
          {...defaultProps}
          image={n(
            'hmsHeaderImage',
            'https://images.ctfassets.net/8k0h54kbe6bj/5pAFV6h9PVzSTQgJY67rbT/3117436e3043bebf720b2f9a7e7619b8/hms-header-image.svg',
          )}
        />
      )
    case 'rikissaksoknari':
      return (
        <DefaultHeader
          {...defaultProps}
          className={
            isSubpage
              ? styles.rikissaksoknariHeaderGridContainerSubpage
              : styles.rikissaksoknariHeaderGridContainerWidth
          }
        />
      )
    case 'vinnueftirlitid':
      return (
        <VinnueftilitidHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
        />
      )
    case 'hljodbokasafn-islands':
      return (
        <HljodbokasafnIslandsHeader
          organizationPage={organizationPage}
          logoAltText={logoAltText}
        />
      )
    case 'tryggingastofnun':
      return (
        <DefaultHeader
          {...defaultProps}
          customTitleColor={n('tryggingastofnunHeaderTitleColor', '#007339')}
        />
      )
    case 'faggilding':
      return (
        <DefaultHeader
          {...defaultProps}
          logoImageClassName={styles.logoLarge}
        />
      )
    case 'rannis':
      return (
        <DefaultHeader
          {...defaultProps}
          background="linear-gradient(271deg, #C00B02 5.72%, #DB0B00 91.04%)"
        />
      )
    default:
      return <DefaultHeader {...defaultProps} />
  }
}

interface ExternalLinksProps {
  organizationPage: OrganizationPage
  showOnMobile?: boolean
}

export const OrganizationExternalLinks: React.FC<
  React.PropsWithChildren<ExternalLinksProps>
> = ({ organizationPage, showOnMobile = true }) => {
  if (organizationPage.externalLinks?.length) {
    const mobileDisplay = showOnMobile ? 'flex' : 'none'
    return (
      <Box
        display={[mobileDisplay, mobileDisplay, 'flex', 'flex']}
        justifyContent={[
          'center',
          showOnMobile ? 'flexEnd' : 'center',
          'flexEnd',
        ]}
        marginBottom={4}
      >
        <Inline
          flexWrap={
            organizationPage.externalLinks?.length === 2 ? 'nowrap' : 'wrap'
          }
          space={2}
        >
          {organizationPage.externalLinks.map((link, index) => {
            // Sjukratryggingar's external links have custom styled buttons
            const isSjukratryggingar =
              organizationPage.slug === 'sjukratryggingar' ||
              organizationPage.slug === 'icelandic-health-insurance' ||
              organizationPage.slug === 'iceland-health'

            const buttonHasLockIcon =
              isSjukratryggingar &&
              (link.text.includes('Gagna') || link.text.includes('Data'))

            let variant = undefined
            if (
              isSjukratryggingar &&
              organizationPage.externalLinks &&
              organizationPage.externalLinks.length === 2
            ) {
              variant = index === 0 ? 'primary' : 'ghost'
            }

            return (
              <Link
                href={link.url}
                key={'organization-external-link-' + index}
                pureChildren={true}
              >
                <Button
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  variant={variant}
                  unfocusable
                  icon={buttonHasLockIcon ? 'lockClosed' : 'open'}
                  iconType="outline"
                  size="medium"
                >
                  <Box paddingY={[0, 2]} paddingLeft={[0, 2]}>
                    {link.text}
                  </Box>
                </Button>
              </Link>
            )
          })}
        </Inline>
      </Box>
    )
  }
  return null
}

interface FooterProps {
  organizations: Array<Organization>
  force?: boolean
}

export const OrganizationFooter: React.FC<
  React.PropsWithChildren<FooterProps>
> = ({ organizations, force = false }) => {
  const organization = force
    ? organizations[0]
    : organizations.find((x) => x?.footerItems?.length > 0)

  const namespace = useMemo(
    () => JSON.parse(organization?.namespace?.fields || '{}'),
    [],
  )
  const n = useNamespace(namespace)

  let OrganizationFooterComponent = null

  const { isServiceWeb } = useContext(GlobalContext)

  switch (organization?.slug) {
    case 'syslumenn':
    case 'district-commissioner':
      OrganizationFooterComponent = (
        <SyslumennFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'sjukratryggingar':
    case 'icelandic-health-insurance':
    case 'iceland-health':
      OrganizationFooterComponent = (
        <SjukratryggingarFooter
          footerItems={organization.footerItems}
          namespace={namespace}
          organizationSlug={organization.slug}
        />
      )
      break
    case 'utlendingastofnun':
    case 'directorate-of-immigration':
      OrganizationFooterComponent = (
        <UtlendingastofnunFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
          organizationSlug={organization.slug}
          namespace={namespace}
        />
      )
      break
    case 'mannaudstorg':
      OrganizationFooterComponent = (
        <MannaudstorgFooter
          title={organization.title}
          logoSrc={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'landlaeknir':
    case 'directorate-of-health':
      OrganizationFooterComponent = (
        <LandlaeknirFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'hsn':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunNordurlandsFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'hsu':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunSudurlandsFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'fiskistofa':
    case 'directorate-of-fisheries':
      OrganizationFooterComponent = (
        <FiskistofaFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'landskjorstjorn':
      OrganizationFooterComponent = (
        <LandskjorstjornFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'rikislogmadur':
    case 'office-of-the-attorney-general-civil-affairs':
      OrganizationFooterComponent = (
        <RikislogmadurFooter
          title={organization.title}
          footerItems={organization.footerItems}
          logo={organization.logo?.url}
        />
      )
      break
    case 'sak':
    case 'sjukrahusid-akureyri':
    case 'akureyri-hospital':
      OrganizationFooterComponent = (
        <SAkFooter
          title={organization.title}
          footerItems={organization.footerItems}
          logo={organization.logo?.url}
        />
      )
      break
    case 'hve':
      OrganizationFooterComponent = (
        <HveFooter
          footerItems={organization.footerItems}
          namespace={namespace}
          logo={organization.logo?.url}
          title={organization.title}
        />
      )
      break
    case 'haskolanam':
    case 'university-studies':
      OrganizationFooterComponent = (
        <UniversityStudiesFooter organization={organization} />
      )
      break
    case 'gev':
      OrganizationFooterComponent = (
        <GevFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'shh':
    case 'samskiptamidstoed-heyrnarlausra-og-heyrnarskertra':
    case 'the-communication-center-for-the-deaf-and-hearing-impaired':
      OrganizationFooterComponent = (
        <ShhFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'hsa':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunAusturlandsFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'nti':
      OrganizationFooterComponent = (
        <IcelandicNaturalDisasterInsuranceFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'samgongustofa':
    case 'transport-authority':
      OrganizationFooterComponent = (
        <WebFooter
          imageUrl={organization.logo?.url}
          heading={organization.title}
          columns={organization.footerItems}
          titleVariant="h2"
        />
      )
      break
    case 'rettindagaesla-fatlads-folks':
    case 'disability-rights-protection':
      OrganizationFooterComponent = (
        <>
          <WebFooter
            imageUrl={organization.logo?.url}
            heading={organization.title}
            columns={organization.footerItems}
            background={organization.footerConfig?.background}
            color={
              organization.footerConfig?.color ||
              organization.footerConfig?.textColor
            }
          />
          <Divider />
        </>
      )
      break
    case 'vinnueftirlitid':
    case 'aosh':
      {
        const footerItems = organization?.footerItems ?? []
        if (footerItems.length === 0) break
        OrganizationFooterComponent = (
          <WebFooter
            heading={organization?.title ?? ''}
            columns={footerItems}
            background={
              isServiceWeb
                ? theme.color.purple100
                : organization?.footerConfig?.background
            }
            color={
              isServiceWeb
                ? theme.color.dark400
                : organization?.footerConfig?.textColor
            }
          />
        )
      }
      break
    case 'stafraent-island':
    case 'digital-iceland':
      OrganizationFooterComponent = (
        <GridContainer>
          <DigitalIcelandFooter
            illustrationSrc={n(
              'digitalIcelandFooterIllustrationSrc',
              'https://images.ctfassets.net/8k0h54kbe6bj/X3D3BSLC0PHyxvOkfhlbt/7d6b3bb0a552af01275b15cac8b16eb9/DigitalIcelandHeaderImage_1__1_.svg',
            )}
            links={n('digitalIcelandFooterLinks', [])}
          />
        </GridContainer>
      )
      break
    default: {
      const footerItems = organization?.footerItems ?? []
      if (footerItems.length === 0) break
      OrganizationFooterComponent = (
        <WebFooter
          heading={organization?.title ?? ''}
          columns={footerItems}
          background={organization?.footerConfig?.background}
          color={organization?.footerConfig?.textColor}
        />
      )
    }
  }

  return OrganizationFooterComponent
}

export const OrganizationChatPanel = ({
  organizationIds,
}: {
  organizationIds: string[]
  pushUp?: boolean
}) => {
  const { activeLocale } = useI18n()

  const organizationIdWithLiveChat = organizationIds.find((id) => {
    return id in liveChatIncConfig[activeLocale]
  })

  if (organizationIdWithLiveChat) {
    return (
      <LiveChatIncChatPanel
        {...liveChatIncConfig[activeLocale][organizationIdWithLiveChat]}
      />
    )
  }

  const organizationIdWithWatson = organizationIds.find((id) => {
    return id in watsonConfig[activeLocale]
  })

  if (organizationIdWithWatson) {
    return (
      <WatsonChatPanel
        {...watsonConfig[activeLocale][organizationIdWithWatson]}
      />
    )
  }

  const organizationIdWithBoost = organizationIds.find((id) => {
    return id in boostChatPanelEndpoints
  })

  if (organizationIdWithBoost) {
    return (
      <BoostChatPanel
        endpoint={
          organizationIdWithBoost as keyof typeof boostChatPanelEndpoints
        }
      />
    )
  }

  return null
}

const SecondaryMenu = ({
  title,
  items,
}: {
  title: string
  items: NavigationItem[]
}) => (
  <Box
    background="purple100"
    borderRadius="large"
    padding={[3, 3, 4]}
    marginY={3}
  >
    <Stack space={[1, 1, 2]}>
      <Text variant="eyebrow" as="h2">
        {title}
      </Text>
      {items.map((link) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        <Link key={link.href} href={link.href} underline="normal">
          <Text
            key={link.href}
            as="span"
            variant={link.active ? 'h5' : 'default'}
          >
            {link.title}
          </Text>
        </Link>
      ))}
    </Stack>
  </Box>
)

const getActiveNavigationItemTitle = (
  navigationItems: NavigationItem[],
  clientUrl: string,
) => {
  const clientUrlWithoutHashOrQueryParams = clientUrl
    .split('?')[0]
    .split('#')[0]

  for (const item of navigationItems) {
    if (clientUrlWithoutHashOrQueryParams === item.href) {
      return item.title
    }
    for (const childItem of item.items ?? []) {
      if (clientUrlWithoutHashOrQueryParams === childItem.href) {
        return childItem.title
      }
    }
  }
}

interface TranslationNamespaceProviderProps {
  messages: IntlConfig['messages']
}

const TranslationNamespaceProvider = ({
  messages,
  children,
}: PropsWithChildren<TranslationNamespaceProviderProps>) => {
  const { activeLocale } = useI18n()

  return (
    <IntlProvider locale={activeLocale} messages={messages}>
      {children}
    </IntlProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const renderConnectedComponent = (slice) => {
  if (!slice?.componentType) return null

  let connectedComponent = null

  switch (slice.componentType) {
    case 'LatestNewsCard':
      connectedComponent = (
        <LatestNewsCardConnectedComponent key={slice?.id} {...slice?.json} />
      )
      break
    case 'Fiskistofa/ShipSearchSidebarInput':
      connectedComponent = <SidebarShipSearchInput key={slice?.id} />
      break
    case 'Personuvernd/SearchInput':
      connectedComponent = (
        <OrganizationSearchInput key={slice?.id} {...slice?.json} />
      )
      break
    case 'OrganizationSearchBox':
      connectedComponent = <SearchBox key={slice?.id} {...slice?.json} />
      break
    default:
      return null
  }

  return (
    <TranslationNamespaceProvider
      messages={slice.translationStrings ?? slice.json ?? {}}
    >
      {connectedComponent}
    </TranslationNamespaceProvider>
  )
}

export const OrganizationWrapper: React.FC<
  React.PropsWithChildren<WrapperProps>
> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems: breadcrumbItemsProp,
  mainContent,
  sidebarContent,
  navigationData: navigationDataProp,
  fullWidthContent = false,
  stickySidebar = true,
  children,
  minimal = false,
  showSecondaryMenu = true,
  showExternalLinks = false,
  showReadSpeaker = true,
  isSubpage = true,
  backLink,
}) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()
  usePlausiblePageview(organizationPage.organization?.trackingDomain)
  const { linkResolver } = useLinkResolver()
  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  const secondaryNavList: NavigationItem[] =
    organizationPage.secondaryMenu?.childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: router.asPath === url,
    })) ?? []

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  const sidebarCards = organizationPage.sidebarCards ?? []

  const namespace = useMemo(() => {
    try {
      return JSON.parse(
        organizationPage.organization?.namespace?.fields || '{}',
      )
    } catch {
      return {}
    }
  }, [organizationPage.organization?.namespace?.fields])

  const n = useNamespace(namespace)

  const indexableBySearchEngine =
    organizationPage.organization?.canPagesBeFoundInSearchResults ??
    organizationPage.canBeFoundInSearchResults ??
    true

  const sitemapContentTypeDeterminesNavigationAndBreadcrumbs = n(
    'sitemapContentTypeDeterminesNavigationAndBreadcrumbs',
    false,
  )

  const { breadcrumbItems, navigationData } = useMemo(() => {
    if (!sitemapContentTypeDeterminesNavigationAndBreadcrumbs) {
      return {
        breadcrumbItems: breadcrumbItemsProp ?? [],
        navigationData: navigationDataProp,
      }
    }

    const breadcrumbItems: BreadCrumbItem[] = (
      organizationPage.navigationLinks?.breadcrumbs ?? []
    ).map((breadcrumb) => ({
      title: breadcrumb.label,
      href: breadcrumb.href,
    }))

    const pathname = new URL(router.asPath, 'https://island.is').pathname

    const navigationData: NavigationData = {
      title: navigationDataProp.title,
      items: (organizationPage.navigationLinks?.topLinks ?? []).map(
        (topLink) => {
          let isAnyChildActive = false
          const midLinks = (topLink.midLinks ?? []).map((midLink) => {
            const isActive = midLink.isActive || pathname === midLink.href
            if (isActive) isAnyChildActive = true
            return {
              title: midLink.label,
              href: midLink.href,
              active: isActive,
            }
          })
          return {
            title: topLink.label,
            href: topLink.href,
            active:
              topLink.isActive || pathname === topLink.href || isAnyChildActive,
            items: midLinks,
          }
        },
      ),
    }

    return {
      breadcrumbItems,
      navigationData,
    }
  }, [
    sitemapContentTypeDeterminesNavigationAndBreadcrumbs,
    organizationPage.navigationLinks?.breadcrumbs,
    organizationPage.navigationLinks?.topLinks,
    router.asPath,
    navigationDataProp,
    breadcrumbItemsProp,
  ])

  const activeNavigationItemTitle = useMemo(() => {
    const activeTitle = getActiveNavigationItemTitle(
      navigationData.items,
      router.asPath,
    )
    const pathname = new URL(router.asPath, 'https://island.is').pathname
    if (
      sitemapContentTypeDeterminesNavigationAndBreadcrumbs &&
      linkResolver('organizationpage', [organizationPage.slug]).href ===
        pathname
    ) {
      return undefined
    }
    return activeTitle
  }, [
    linkResolver,
    navigationData.items,
    organizationPage.slug,
    router.asPath,
    sitemapContentTypeDeterminesNavigationAndBreadcrumbs,
  ])

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      >
        {!indexableBySearchEngine && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
      <Box>
        <OrganizationHeader
          organizationPage={organizationPage}
          isSubpage={isSubpage}
        />
      </Box>
      {!minimal && (
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[6, 6, 9]}
          isSticky={false}
          fullWidthContent={fullWidthContent}
          sidebarContent={
            <SidebarContainer>
              <Stack space={3}>
                {backLink && (
                  <Box display={['none', 'none', 'block']} printHidden>
                    <LinkV2 href={backLink.url}>
                      <Button
                        preTextIcon="arrowBack"
                        preTextIconType="filled"
                        size="small"
                        type="button"
                        variant="text"
                        truncate
                        unfocusable
                      >
                        {backLink.text}
                      </Button>
                    </LinkV2>
                  </Box>
                )}
                <Navigation
                  baseId="pageNav"
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={activeNavigationItemTitle}
                  renderLink={(link, item) => {
                    return !item?.href || shouldLinkBeAnAnchorTag(item.href) ? (
                      link
                    ) : (
                      <NextLink href={item.href} legacyBehavior>
                        {link}
                      </NextLink>
                    )
                  }}
                />
              </Stack>
              {showSecondaryMenu && (
                <>
                  {organizationPage.secondaryMenu &&
                    secondaryNavList.length > 0 && (
                      <SecondaryMenu
                        title={organizationPage.secondaryMenu.name}
                        items={secondaryNavList}
                      />
                    )}
                  <Box
                    marginY={
                      organizationPage.secondaryMenu &&
                      secondaryNavList.length > 0
                        ? 0
                        : 3
                    }
                    className={styles.sidebarCardContainer}
                  >
                    {(organizationPage.sidebarCards ?? []).map((card) => {
                      if (card.__typename === 'SidebarCard') {
                        let imageUrl =
                          card.image?.url ||
                          'https://images.ctfassets.net/8k0h54kbe6bj/6jpT5mePCNk02nVrzVLzt2/6adca7c10cc927d25597452d59c2a873/bitmap.png'

                        imageUrl += `?w=${STICKY_NAV_MAX_WIDTH_LG}`

                        return (
                          <ProfileCard
                            key={card.id}
                            title={card.title}
                            description={card.contentString}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            link={card.link}
                            image={imageUrl}
                            size="small"
                          />
                        )
                      }

                      if (card.__typename === 'ConnectedComponent') {
                        return renderConnectedComponent(card)
                      }

                      return null
                    })}
                  </Box>
                </>
              )}
              {sidebarContent}
            </SidebarContainer>
          }
        >
          {isMobile && (
            <Box className={styles.menuStyle}>
              {showExternalLinks && (
                <OrganizationExternalLinks
                  organizationPage={organizationPage}
                  showOnMobile={true}
                />
              )}
              <Box marginY={2}>
                <Navigation
                  baseId="pageNavMobile"
                  isMenuDialog={true}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={activeNavigationItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href} legacyBehavior>
                        {link}
                      </NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
              {organizationPage.secondaryMenu && secondaryNavList.length > 0 && (
                <Box marginY={2}>
                  <Navigation
                    baseId="secondaryNav"
                    colorScheme="purple"
                    isMenuDialog={true}
                    title={organizationPage.secondaryMenu.name}
                    items={secondaryNavList}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href} legacyBehavior>
                          {link}
                        </NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          <GridContainer>
            <GridRow>
              <GridColumn
                span={fullWidthContent ? ['9/9', '9/9', '7/9'] : '9/9'}
                offset={fullWidthContent ? ['0', '0', '1/9'] : '0'}
              >
                {showExternalLinks && (
                  <OrganizationExternalLinks
                    organizationPage={organizationPage}
                    showOnMobile={false}
                  />
                )}
                {breadcrumbItems && (
                  <Breadcrumbs
                    items={breadcrumbItems ?? []}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href} legacyBehavior>
                          {link}
                        </NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                )}

                {showReadSpeaker && (
                  <Webreader
                    marginTop={breadcrumbItems?.length ? 3 : 0}
                    marginBottom={breadcrumbItems?.length ? 0 : 3}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    readId={null}
                    readClass="rs_read"
                  />
                )}

                {pageDescription && (
                  <Box
                    className="rs_read"
                    paddingTop={[2, 2, breadcrumbItems ? 5 : 0]}
                    paddingBottom={SLICE_SPACING}
                  >
                    <Text variant="default">{pageDescription}</Text>
                  </Box>
                )}
              </GridColumn>
            </GridRow>
          </GridContainer>

          {isMobile && sidebarContent}

          <Box className="rs_read" paddingTop={fullWidthContent ? 0 : 4}>
            {mainContent ?? children}
          </Box>

          {isMobile && !isSubpage && sidebarCards.length > 0 && (
            <Box marginY={4}>
              <Stack space={3}>
                {sidebarCards.map((card) => {
                  if (card.__typename === 'SidebarCard') {
                    return (
                      <ProfileCard
                        key={card.id}
                        title={card.title}
                        description={card.contentString}
                        link={card.link ?? undefined}
                        size="small"
                      />
                    )
                  }

                  if (card.__typename === 'ConnectedComponent') {
                    return renderConnectedComponent(card)
                  }

                  return null
                })}
              </Stack>
            </Box>
          )}
        </SidebarLayout>
      )}

      {minimal && (
        <GridContainer>
          <GridRow>
            <GridColumn
              paddingTop={6}
              span={['12/12', '12/12', '10/12']}
              offset={['0', '0', '1/12']}
              className="rs_read"
            >
              {mainContent}
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {!!mainContent && <Box className="rs_read">{children}</Box>}
      {!minimal && (
        <Box className="rs_read" marginTop="auto">
          <OrganizationFooter
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            organizations={[organizationPage.organization]}
            force={true}
          />
        </Box>
      )}
      {n('enableOrganizationChatPanelForOrgPages', true) && (
        <OrganizationChatPanel
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          organizationIds={[organizationPage?.organization?.id]}
        />
      )}
    </>
  )
}
