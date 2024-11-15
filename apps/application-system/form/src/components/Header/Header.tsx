import React, { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'
import { useHeaderInfo } from '@island.is/application/ui-shell'
import { UserMenu } from '@island.is/shared/components'

import { fixSvgUrls } from '../../utils'

export const Header: FC<React.PropsWithChildren<unknown>> = () => {
  const location = useLocation()
  const { info } = useHeaderInfo()

  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    const url = window.location.origin + location.pathname
    location.pathname.includes('umsoknir') && fixSvgUrls(url)
  }, [location])

  return (
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
          headerItems={<UserMenu showDropdownLanguage small />}
        />
      </GridContainer>
    </Box>
  )
}
