import React, { FC, useEffect } from 'react'
import { useLocation, useMatches } from 'react-router-dom'

import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'
import { useHeaderInfo } from '@island.is/application/ui-shell'
import { DelegationBanner, UserMenu } from '@island.is/shared/components'

import { BASE_PATH } from '../../lib/basePath'
import { fixSvgUrls } from '../../utils'

export const Header: FC<React.PropsWithChildren<unknown>> = () => {
  const location = useLocation()
  const { info, hideDelegationBanner } = useHeaderInfo()
  const slug = useMatches().find((match) => match.params.slug)?.params.slug
  const switchTargetLink = slug
    ? `${window.location.origin}${BASE_PATH}/${slug}`
    : `${window.location.origin}/minarsidur/umsoknir`

  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    const url = window.location.origin + location.pathname
    location.pathname.includes('umsoknir') && fixSvgUrls(url)
  }, [location])

  return (
    <>
      <Box background="white">
        <GridContainer>
          <UIHeader
            info={
              info.applicationName && info.institutionName
                ? {
                    title: info.institutionName,
                    description: info.applicationName,
                  }
                : undefined
            }
            logoRender={(logo) => <a href="/minarsidur/umsoknir">{logo}</a>}
            headerItems={
              <UserMenu
                showDropdownLanguage
                small
                switchUserTargetLink={switchTargetLink}
              />
            }
          />
        </GridContainer>
      </Box>
      {!hideDelegationBanner && (
        <DelegationBanner exitTargetLink={switchTargetLink} />
      )}
    </>
  )
}
