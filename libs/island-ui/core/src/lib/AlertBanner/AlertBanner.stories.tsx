import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { AlertBanner } from './AlertBanner'
import { Box } from '../Box/Box'

export default {
  title: 'Alerts/AlertBanner',
  component: AlertBanner,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=203%3A734',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=1%3A12',
  }),
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
