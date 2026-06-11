'use client'

import React from 'react'
import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'
import { useHeaderInfo } from './HeaderInfoProvider'

export const AppHeader = () => {
  const { info } = useHeaderInfo()

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
        />
      </GridContainer>
    </Box>
  )
}
