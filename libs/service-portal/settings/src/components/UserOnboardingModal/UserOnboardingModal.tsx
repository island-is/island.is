import { Text, toast } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { User } from 'oidc-client'
import React, { FC, useState } from 'react'

interface Props {
  userInfo: User
}

export const UserOnboardingModal: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(true)

  const handleCloseModal = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    setIsOpen(false)
  }

  return (
    <Modal onCloseModal={handleCloseModal} isOpen={isOpen}>
      <Text variant="h1">User onboarding modal</Text>
    </Modal>
  )
}
