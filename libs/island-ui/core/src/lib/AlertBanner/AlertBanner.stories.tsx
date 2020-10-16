import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { AlertBanner } from './AlertBanner'
import { Box } from '../Box/Box'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=203%3A734'

export default {
  title: 'Alerts/AlertBanner',
  component: AlertBanner,
  decorators: [withDesign],
  parameters: {
    docs: {
      description: {
        component: `[View in Figma](${figmaLink})`,
      },
    },
    design: {
      type: 'figma',
      url: figmaLink,
    },
  },
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
