import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { AlertBanner } from './AlertBanner'
import { Box } from '../Box/Box'

export default {
  title: 'Alerts/AlertBanner',
  component: AlertBanner,
  parameters: withFigma('AlertBanner'),
}

export const Default = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
      />
    </Box>
  )
}

export const Error = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
        variant="error"
      />
    </Box>
  )
}
export const ErrorDismissable = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
        variant="error"
        dismissable
      />
    </Box>
  )
}

export const Warning = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
        variant="warning"
      />
    </Box>
  )
}

export const Success = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
        variant="success"
      />
    </Box>
  )
}

export const Info = () => {
  return (
    <Box paddingY={2}>
      <AlertBanner
        title="Viðbrögð við Covid-19"
        description="Lokað verður fyrir að sækja um fæðingarorlof á meðan Covid-19 veikin gengur yfir."
        link={{ title: 'Frekari upplýsingar', href: '#' }}
        variant="info"
      />
    </Box>
  )
}
