import React from 'react'

import { ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { DefaultHeader } from '@island.is/web/components'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './SyslumennDefaultHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
  isSubpage: boolean
}

const SyslumennDefaultHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText, isSubpage }) => {
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()

  const themeProp = organizationPage.themeProperties

  return (
    <div
      style={{
        background:
          (width > theme.breakpoints.lg
            ? themeProp.backgroundColor
            : 'linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)') ??
          '',
      }}
      className={styles.gridContainerWidth}
    >
      <DefaultHeader
        title={organizationPage.title}
        titleColor="white"
        imagePadding={themeProp.imagePadding ?? '0'}
        fullWidth={themeProp.fullWidth ?? false}
        imageIsFullHeight={themeProp.imageIsFullHeight ?? false}
        imageObjectFit={
          themeProp?.imageObjectFit === 'cover' ? 'cover' : 'contain'
        }
        logo={organizationPage.organization?.logo?.url}
        logoHref={
          linkResolver('organizationpage', [organizationPage.slug]).href
        }
        logoAltText={logoAltText}
        titleSectionPaddingLeft={
          organizationPage.themeProperties
            .titleSectionPaddingLeft as ResponsiveSpace
        }
        isSubpage={isSubpage}
        mobileBackground={
          organizationPage.themeProperties.mobileBackgroundColor
        }
      />
    </div>
  )
}

export default SyslumennDefaultHeader
