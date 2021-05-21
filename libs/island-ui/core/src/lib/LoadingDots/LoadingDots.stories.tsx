import React from 'react'
import { LoadingDots } from './LoadingDots'
import { Box } from '../Box/Box'

export default {
  title: 'Navigation/LoadingDots',
  component: LoadingDots,
}

export const Blue = () => <LoadingDots />
export const BlueLarge = () => <LoadingDots large />

export const SingleBlue = () => <LoadingDots single />
export const SingleBlueLarge = () => <LoadingDots large single />

export const GradientLarge = () => <LoadingDots large color="gradient" />
export const SingleGradientLarge = () => (
  <LoadingDots single large color="gradient" />
)

export const CenteredInsideBox = () => (
  <Box
    display="flex"
    width="full"
    alignItems="center"
    justifyContent="center"
    style={{ height: 200, backgroundColor: '#0061ff' }}
  >
    <LoadingDots large color="white" />
  </Box>
)
