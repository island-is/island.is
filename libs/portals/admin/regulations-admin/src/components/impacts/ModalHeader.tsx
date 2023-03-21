import {
  Text,
  Box,
  Button,
  FocusableBox,
  Hidden,
  Logo,
} from '@island.is/island-ui/core'

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
    >
      <FocusableBox component="div">
        <Hidden above="sm">
          <Logo width={40} iconOnly id="modal-header-logo-small" />
        </Hidden>
        <Hidden below="md">
          <Logo width={160} id="modal-header-logo" />
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
