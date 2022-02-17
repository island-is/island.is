import {
  Text,
  Box,
  Button,
  FocusableBox,
  Hidden,
  Logo,
} from '@island.is/island-ui/core'
import React from 'react'

type ModalHeaderProps = {
  closeModal: () => void
}

export const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="spaceBetween"
      marginX={6}
    >
      <FocusableBox component="div">
        <Hidden above="md">
          <Logo width={40} iconOnly />
        </Hidden>
        <Hidden below="lg">
          <Logo width={160} />
        </Hidden>
      </FocusableBox>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box marginRight={2}>
          <Text variant="medium">Loka glugga</Text>
        </Box>
        <Button
          colorScheme="light"
          circle
          icon="close"
          onClick={() => props.closeModal()}
          aria-label="Loka glugga"
        ></Button>
      </Box>
    </Box>
  )
}
