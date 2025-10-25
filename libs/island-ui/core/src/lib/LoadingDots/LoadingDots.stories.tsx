import React from 'react'
import { LoadingDots } from './LoadingDots'
import { Box } from '../Box/Box'

export default {
  title: 'Navigation/LoadingDots',
  component: LoadingDots,
}

export const Blue = () => <LoadingDots />
export const BlueLarge = () => <LoadingDots size="large" />

export const SingleBlue = () => <LoadingDots single />
export const SingleBlueLarge = () => <LoadingDots size="large" single />

export const GradientLarge = () => <LoadingDots size="large" color="gradient" />
export const SingleGradientLarge = () => (
  <LoadingDots single size="large" color="gradient" />
)

export const CenteredInsideBox = () => (
  <Box
    display="flex"
    width="full"
    alignItems="center"
    justifyContent="center"
    style={{ height: 200, backgroundColor: '#0061ff' }}
  >
    <LoadingDots size="large" color="white" />
  </Box>
)
