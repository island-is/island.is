'use client'

import React from 'react'
import {
  Box,
  GridContainer,
  Header as UIHeader,
} from '@island.is/island-ui/core'

interface AppHeaderProps {
  institutionName?: string
  applicationName?: string
}

export function AppHeader({
  institutionName,
  applicationName,
}: AppHeaderProps) {
  return (
    <Box background="white">
      <GridContainer>
        <UIHeader
          info={
            applicationName && institutionName
              ? {
                  title: institutionName,
                  description: applicationName,
                }
              : undefined
          }
          logoRender={(logo) => <a href="/minarsidur/umsoknir">{logo}</a>}
        />
      </GridContainer>
    </Box>
  )
}
