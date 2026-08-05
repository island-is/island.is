/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/LayoverModal.tsx
 *
 * Full-screen modal for editing impacts (amendments / cancellations).
 */
import { ReactNode } from 'react'
import {
  Box,
  Button,
  FocusableBox,
  Hidden,
  Logo,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import * as s from './Impacts.css'

// ---------------------------------------------------------------------------

type ModalHeaderProps = {
  closeModal: () => void
}

const ModalHeader = ({ closeModal }: ModalHeaderProps) => {
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
          onClick={() => closeModal()}
          aria-label="Loka glugga"
        ></Button>
      </Box>
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type LayoverModalProps = {
  id: string
  closeModal: () => void
  children: ReactNode
}

export const LayoverModal = (props: LayoverModalProps) => {
  const { children, closeModal, id } = props

  return (
    <ModalBase
      baseId={id}
      isVisible={true}
      initialVisibility={true}
      className={s.layoverModal}
      hideOnClickOutside={false}
      hideOnEsc={false}
      removeOnClose
    >
      <Box padding={[3, 3, 3, 6]}>
        <ModalHeader closeModal={closeModal} />
        {children}
      </Box>
    </ModalBase>
  )
}
