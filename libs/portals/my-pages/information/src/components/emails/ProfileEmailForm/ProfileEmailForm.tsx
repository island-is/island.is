import { Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { emailsMsg as m, emailsMsg } from '../../../lib/messages'
import {
  VerifyTemplate,
  VerifyTemplateInput,
} from '../..//verify/VerifyTemplate/VerifyTemplate'
import { Modal } from '../../Modal/Modal'
import { AddEmail } from '../AddEmail/AddEmail'
import {
  AddEmailMutation,
  useAddEmailMutation,
} from './addEmail.mutation.generated'
import { useCreateEmailVerificationMutation } from './createEmailVerification.mutation.generated'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { client } from '@island.is/portals/my-pages/graphql'

type ProfileEmailFormProps = {
  onCancel?(): void
  onAddSuccess?(data: AddEmailMutation['userEmailsAddEmail']): void
}

export const ProfileEmailForm = ({
  onCancel,
  onAddSuccess,
}: ProfileEmailFormProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [createEmailVerification, { data, loading, error }] =
    useCreateEmailVerificationMutation()

  const [
    addEmail,
    { loading: addEmailLoading, error: addEmailError, reset: addEmailReset },
  ] = useAddEmailMutation({
    onCompleted: (data) => {
      if (data.userEmailsAddEmail) {
        setOpenModal(false)
        onAddSuccess?.(data.userEmailsAddEmail)
        client.refetchQueries({
          include: [USER_PROFILE],
        })
        toast.success(formatMessage(emailsMsg.addEmailSuccess))
      }
    },
  })

  const verifyEmail = (email: string) => {
    createEmailVerification({
      variables: {
        input: {
          email,
        },
      },
    })
  }

  const onNoCodeReceivedCallback = useCallback(async (email: string) => {
    if (email) {
      await verifyEmail(email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseModal = () => {
    setOpenModal(false)
    addEmailReset()
  }

  const link = useMemo(
    () => ({
      label: formatMessage(m.cancel),
      onClick: handleCloseModal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addEmailError],
  )

  const intro = useMemo(
    () =>
      formatMessage(emailsMsg.securityCodeEmailIntro, {
        email: (
          <Text variant="h5" as="span">
            {email}
          </Text>
        ),
        br: <br />,
      }),

    [email, formatMessage],
  )

  useEffect(() => {
    if (data?.createEmailVerification?.created) {
      setOpenModal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.createEmailVerification])

  const onSubmitCallback = useCallback(
    async (input: VerifyTemplateInput) => {
      addEmail({
        variables: {
          input,
        },
      })
    },
    [addEmail],
  )

  const onAddEmail = async (email: string) => {
    setEmail(email)
    await verifyEmail(email)
  }

  return (
    <>
      <AddEmail
        onAddEmail={onAddEmail}
        loading={loading}
        error={!!error}
        onCancel={onCancel}
      />
      <Modal
        baseId="service-portal-profile-email-form"
        isVisible={openModal && !!email}
        onClose={handleCloseModal}
      >
        {email && (
          <VerifyTemplate
            loading={addEmailLoading}
            serverError={addEmailError}
            email={email}
            title={formatMessage(emailsMsg.securityCode)}
            intro={intro}
            link={link}
            onNoCodeReceivedCallback={onNoCodeReceivedCallback}
            onSubmitCallback={onSubmitCallback}
          />
        )}
      </Modal>
    </>
  )
}
