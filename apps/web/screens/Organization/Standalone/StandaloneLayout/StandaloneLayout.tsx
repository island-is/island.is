import { PropsWithChildren } from 'react'
import Head from 'next/head'

import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'
import {
  Footer,
  PageLoader,
  SkipToMainContent,
} from '@island.is/web/components'
import { OrganizationIslandFooter } from '@island.is/web/components'
import { PRELOADED_FONTS } from '@island.is/web/constants'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { getBackgroundStyle } from '@island.is/web/utils/organization'

import { Header, HeaderProps } from './components/Header'
import { Navigation, NavigationProps } from './components/Navigation'

interface StandaloneLayoutProps {
  organizationPage: OrganizationPage
  seo?: {
    title: string
    description?: string
    image?: {
      url: string
      width?: number
      height?: number
    }
  }
  isFrontpage?: boolean
}

const StandaloneLayout = ({
  organizationPage,
  seo,
  children,
  isFrontpage,
}: PropsWithChildren<StandaloneLayoutProps>) => {
  const headerProps: HeaderProps = {
    fullWidth: organizationPage?.themeProperties.fullWidth ?? false,
    image: organizationPage?.defaultHeaderImage?.url,
    background: getBackgroundStyle(organizationPage?.themeProperties),
    titleColor:
      (organizationPage.themeProperties
        .textColor as HeaderProps['titleColor']) ?? 'dark400',
    imagePadding: organizationPage?.themeProperties.imagePadding || '20px',
    imageIsFullHeight:
      organizationPage?.themeProperties.imageIsFullHeight ?? true,
    imageObjectFit:
      organizationPage?.themeProperties.imageObjectFit === 'cover'
        ? 'cover'
        : 'contain',
    imageObjectPosition:
      organizationPage?.themeProperties.imageObjectPosition === 'left'
        ? 'left'
        : organizationPage?.themeProperties.imageObjectPosition === 'right'
        ? 'right'
        : 'center',
    titleSectionPaddingLeft: organizationPage?.themeProperties
      .titleSectionPaddingLeft as ResponsiveSpace,
    mobileBackground: organizationPage?.themeProperties.mobileBackgroundColor,
    isFrontpage: isFrontpage,
  }

  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  const navigationProps: NavigationProps = {
    logo: organizationPage?.organization?.logo?.url,
    title: organizationPage?.title ?? '',
    fullWidth: organizationPage?.themeProperties.fullWidth ?? false,
    logoAltText: '',
    links: organizationPage.topLevelNavigation?.links ?? [],
    homeHref: linkResolver('organizationpage', [organizationPage.slug]).href,
  }

  const featuredTitle = seo?.title ?? organizationPage.title
  const featuredDescription = seo?.description ?? organizationPage.description
  const featuredImage = seo?.image ?? organizationPage.featuredImage

  return (
    <>
      <Head>
        {PRELOADED_FONTS.map((href, index) => {
          return (
            <link
              key={index}
              rel="preload"
              href={href}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          )
        })}

        {/* TODO: Load a different favicon? */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="website" key="ogWebsite" />

        {/* Url */}
        <meta property="og:url" content={'fullUrl'} key="ogUrl" />
        <meta property="twitter:url" content={'fullUrl'} key="twitterUrl" />

        {/* Title */}
        <title>{featuredTitle}</title>
        <meta name="title" content={featuredTitle} key="title" />
        <meta property="og:title" content={featuredTitle} key="ogTitle" />
        <meta
          property="twitter:title"
          content={featuredTitle}
          key="twitterTitle"
        />

        {/* Description */}
        <meta
          name="description"
          content={featuredDescription}
          key="description"
        />
        <meta
          property="og:description"
          content={featuredDescription}
          key="ogDescription"
        />
        <meta
          property="twitter:description"
          content={featuredDescription}
          key="twitterDescription"
        />

        {/*  TODO: Maybe we should also check if the image is an svg or other invalid formats */}
        {/* Image */}
        {featuredImage?.url && (
          <>
            <meta
              property="og:image"
              content={featuredImage.url}
              key="ogImage"
            />
            {Boolean(featuredImage.width) && Boolean(featuredImage.height) && (
              <>
                <meta
                  property="og:image:width"
                  content={String(featuredImage.width)}
                  key="ogImageWidth"
                />
                <meta
                  property="og:image:height"
                  content={String(featuredImage.height)}
                  key="ogImageHeight"
                />
              </>
            )}
            <meta
              property="twitter:image"
              content="https://island.is/island-fb-1200x630.png"
              key="twitterImage"
            />
            <meta
              property="twitter:card"
              content="summary_large_image"
              key="twitterCard"
            />
          </>
        )}
      </Head>
      <SkipToMainContent
        title={
          activeLocale === 'is' ? 'Fara beint í efnið' : 'Skip to main content'
        }
      />
      <PageLoader />
      <Navigation {...navigationProps} />
      <Header {...headerProps} />
      <Box component="main" id="main-content" paddingY={5}>
        <GridContainer>{children}</GridContainer>
      </Box>
      <Footer
        heading={organizationPage?.organization?.title || ''}
        columns={organizationPage?.organization?.footerItems || []}
        titleVariant="h2"
        color="white"
        background={getBackgroundStyle(organizationPage?.themeProperties)}
      />
      <OrganizationIslandFooter />
    </>
  )
}

export default StandaloneLayout
