import React from 'react'

import { ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { DefaultHeader } from '@island.is/web/components'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './FiskistofaDefaultHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
  isSubpage: boolean
}

const FiskistofaDefaultHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText, isSubpage }) => {
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()

  const themeProp = organizationPage.themeProperties

  return (
    <div
      style={{
        background:
          (width > theme.breakpoints.lg && !isSubpage
            ? themeProp.backgroundColor
            : 'no-repeat 52% 30% ,linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)') ??
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

export default FiskistofaDefaultHeader
