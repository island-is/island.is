import React from 'react'
import {
  Box,
  Button,
  FocusableBox,
  Hidden,
  Logo,
} from '@island.is/island-ui/core'

interface OnboardingHeaderProps {
  dropOnboarding: () => void
}

export const OnboardingHeader = ({ dropOnboarding }: OnboardingHeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      height="full"
      background="white"
      paddingX={[2, 2, 4, 4, 6]}
      paddingBottom={[2, 7]}
    >
      <FocusableBox component="div">
        <Hidden above="md">
          <Logo width={40} iconOnly />
        </Hidden>
        <Hidden below="lg">
          <Logo width={160} />
        </Hidden>
      </FocusableBox>
      <div>
        <Button variant="text" icon="close" onClick={dropOnboarding}>
          Loka glugga
        </Button>
      </div>
    </Box>
  )
}
