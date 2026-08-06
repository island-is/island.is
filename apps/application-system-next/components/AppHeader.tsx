'use client'

import React from 'react'
import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'
import { UserMenu } from '@island.is/shared/components'
import { useHeaderInfo } from './HeaderInfoProvider'

export const AppHeader = () => {
  const { info } = useHeaderInfo()

  return (
    <Box background="white">
      <GridContainer>
        <UIHeader
          info={
            info.applicationName
              ? {
                  title: info.institutionName ?? info.applicationName,
                  description: info.institutionName
                    ? info.applicationName
                    : undefined,
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
