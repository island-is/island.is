import { PropsWithChildren } from 'react'

import { GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'
import { Footer } from '@island.is/web/components'
import { OrganizationIslandFooter } from '@island.is/web/components'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { getBackgroundStyle } from '@island.is/web/utils/organization'

import { Header, HeaderProps } from './components/Header'
import { Navigation, NavigationProps } from './components/Navigation'

interface StandaloneLayoutProps {
  organizationPage: OrganizationPage
}

const StandaloneLayout = ({
  organizationPage,
  children,
}: PropsWithChildren<StandaloneLayoutProps>) => {
  const headerProps: HeaderProps = {
    fullWidth: organizationPage?.themeProperties.fullWidth ?? false,
    image: organizationPage?.defaultHeaderImage?.url,
    background: getBackgroundStyle(organizationPage?.themeProperties),
    title: organizationPage?.title ?? '',
    logo: organizationPage?.organization?.logo?.url,
    titleColor: 'dark400',
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
    logoAltText: '',
    titleSectionPaddingLeft: organizationPage?.themeProperties
      .titleSectionPaddingLeft as ResponsiveSpace,
    mobileBackground: organizationPage?.themeProperties.mobileBackgroundColor,
    isSubpage: false,
  }
  const navigationProps: NavigationProps = {
    logo: organizationPage?.organization?.logo?.url,
    title: organizationPage?.title ?? '',
    fullWidth: organizationPage?.themeProperties.fullWidth ?? false,
    logoAltText: '',
    links: organizationPage.topLevelNavigation?.links ?? [],
  }

  return (
    <>
      <Navigation {...navigationProps} />
      <Header {...headerProps} />
      <main>
        <GridContainer>{children}</GridContainer>
      </main>
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
