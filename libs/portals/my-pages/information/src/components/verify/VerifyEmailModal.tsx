import { Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { useCallback, useMemo } from 'react'
import { emailsMsg, emailsMsg as m } from '../../lib/messages'
import {
  VerifyTemplate,
  VerifyTemplateInput,
} from '../verify/VerifyTemplate/VerifyTemplate'

import { USER_PROFILE, client } from '@island.is/portals/my-pages/graphql'
import { useEffectOnce } from '@island.is/react-spa/shared'
import { Modal } from '../Modal/Modal'
import { useAddEmailMutation } from '../emails/ProfileEmailForm/addEmail.mutation.generated'
import { useCreateEmailVerificationMutation } from '../emails/ProfileEmailForm/createEmailVerification.mutation.generated'
import { useUpdateActorProfileEmailMutation } from '../notificationSettings/ActorProfileEmails/actorProfileUpdate.mutation.generated'

interface VerifyEmailModalProps {
  type: 'add' | 'update'
  open?: boolean
  email: string
  onClose(): void
  onSuccess?(emailsId: string): void
}

export const VerifyEmailModal = ({
  type = 'add',
  open = false,
  onClose,
  email,
  onSuccess,
}: VerifyEmailModalProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const [createEmailVerification, { error: createEmailVerificationError }] =
    useCreateEmailVerificationMutation()

  const [addEmail, { loading: addEmailLoading, error: addEmailError }] =
    useAddEmailMutation({
      onCompleted: (data) => {
        if (data.userEmailsAddEmail && type === 'add') {
          onClose()
          onSuccess?.(data.userEmailsAddEmail.id)
          client.refetchQueries({
            include: [USER_PROFILE],
          })
          toast.success(formatMessage(emailsMsg.addEmailSuccess))
        }
      },
    })

  const [
    updateActorProfileEmail,
    {
      loading: updateActorProfileEmailLoading,
      error: updateActorProfileEmailError,
    },
  ] = useUpdateActorProfileEmailMutation({
    onCompleted: (data) => {
      if (data.updateActorProfileEmail) {
        onClose()
        onSuccess?.(data.updateActorProfileEmail.emailsId)
        client.refetchQueries({
          include: [USER_PROFILE],
        })
      }
    },
  })

  const serverError =
    addEmailError ||
    createEmailVerificationError ||
    updateActorProfileEmailError

  const verifyEmail = (email: string) => {
    createEmailVerification({
      variables: {
        input: {
          email,
        },
      },
    })
  }

  useEffectOnce(() => {
    verifyEmail(email)
  })

  const onNoCodeReceivedCallback = useCallback(async (email: string) => {
    if (email) {
      await verifyEmail(email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const link = useMemo(
    () => ({
      label: formatMessage(m.cancel),
      onClick: onClose,
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

  const onSubmit = useCallback(
    async (input: VerifyTemplateInput) => {
      if (type === 'add') {
        addEmail({
          variables: {
            input,
          },
        })
      } else {
        updateActorProfileEmail({
          variables: {
            input: {
              email: input.email,
              emailVerificationCode: input.code,
            },
          },
        })
      }
    },
    [addEmail, updateActorProfileEmail, type],
  )

  return (
    <Modal
      baseId="service-portal-profile-email-form"
      isVisible={open}
      onClose={onClose}
    >
      <VerifyTemplate
        loading={addEmailLoading || updateActorProfileEmailLoading}
        serverError={serverError}
        email={email}
        title={formatMessage(emailsMsg.securityCode)}
        intro={intro}
        link={link}
        onNoCodeReceivedCallback={onNoCodeReceivedCallback}
        onSubmitCallback={onSubmit}
      />
    </Modal>
  )
}
