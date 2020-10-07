import React from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Box } from '../Box/Box'

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
}

export const Default = () => (
  <Box padding="gutter">
    <Breadcrumbs>
      <span>Ísland.is</span>
      <a href="/">Dómstólar og réttarfar</a>
      <a href="/">Lögregluembætti</a>
    </Breadcrumbs>
  </Box>
)
