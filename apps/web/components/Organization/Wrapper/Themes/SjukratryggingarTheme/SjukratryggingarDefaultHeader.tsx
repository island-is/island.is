import React from 'react'

import { ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { DefaultHeader } from '@island.is/web/components'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './SjukratryggingarDefaultHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
  isSubpage: boolean
}

const SjukratryggingarDefaultHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText, isSubpage }) => {
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()

  const themeProp = organizationPage.themeProperties

  return (
    <div
      style={{
        background:
          width <= theme.breakpoints.sm
            ? '#40c5e5'
            : (width > theme.breakpoints.lg && !isSubpage
                ? themeProp.backgroundColor
                : `linear-gradient(184.95deg, #40c5e5 8.38%, rgba(64, 197, 227, 0.1) 39.64%, rgba(244, 247, 247, 0) 49.64%),
               linear-gradient(273.41deg, #f4f7f7 -9.24%, #40c5e5 66.78%, #a4def1 105.51%)`) ??
              '',
      }}
      className={styles.gridContainerWidth}
    >
      <DefaultHeader
        title={organizationPage.title}
        titleColor="dark400"
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

export default SjukratryggingarDefaultHeader
