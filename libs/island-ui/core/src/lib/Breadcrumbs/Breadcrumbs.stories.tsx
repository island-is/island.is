import React from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Box } from '../Box'

export default {
  title: 'Components/Breadcrumbs',
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
