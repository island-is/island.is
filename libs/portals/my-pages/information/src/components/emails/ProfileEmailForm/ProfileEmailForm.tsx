import { useNamespaces } from '@island.is/localization'

import { useState } from 'react'
import { VerifyEmailModal } from '../../verify/VerifyEmailModal'
import { AddEmail } from '../AddEmail/AddEmail'

type ProfileEmailFormProps = {
  onCancel?(): void
  onAddSuccess?(emailsId: string): void
}

export const ProfileEmailForm = ({
  onCancel,
  onAddSuccess,
}: ProfileEmailFormProps) => {
  useNamespaces('sp.settings')
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState<string | undefined>()

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const onAddEmail = async (email: string) => {
    setEmail(email)
    setOpenModal(true)
  }

  return (
    <>
      <AddEmail onAddEmail={onAddEmail} onCancel={onCancel} />
      {email && openModal && (
        <VerifyEmailModal
          type="add"
          open={openModal}
          email={email}
          onClose={handleCloseModal}
          onSuccess={onAddSuccess}
        />
      )}
    </>
  )
}
