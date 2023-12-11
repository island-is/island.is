import React, { useMemo } from 'react'
import cn from 'classnames'

import { DefaultHeader } from '@island.is/web/components'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'

import * as styles from './VinnueftirlitidHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const VinnueftilitidHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)

  const themeProp = organizationPage.themeProperties

  return (
    <div
      className={cn({
        [styles.headerBorder]: true,
        [styles.headerBorderWidth]: !themeProp.fullWidth,
      })}
    >
      <DefaultHeader
        title={organizationPage.title}
        image={n(
          'vinnueftilitidHeaderImage',
          'https://images.ctfassets.net/8k0h54kbe6bj/6OqSuq1pVpiOxZ5o6fzGSK/27622b5aeb9d7ddbca53a1cc3d203b35/vinnueftirlitid.png',
        )}
        imagePadding={themeProp.imagePadding ?? '0'}
        background={n(
          'vinnueftirlitidHeaderBackgroundImage',
          "repeat url('https://images.ctfassets.net/8k0h54kbe6bj/2MLg9apOlM56iVrrs9Gnn0/5a0085da93fa7a532d2388e75f77522b/VER-bg-banner.svg')",
        )}
        fullWidth={themeProp.fullWidth ?? false}
        imageIsFullHeight={themeProp.imageIsFullHeight ?? false}
        imageObjectFit={
          themeProp?.imageObjectFit === 'cover' ? 'cover' : 'contain'
        }
        logo={organizationPage.organization?.logo?.url}
        logoHref={
          linkResolver('organizationpage', [organizationPage.slug]).href
        }
        className={styles.gridContainer}
      />
    </div>
  )
}

export default VinnueftilitidHeader
