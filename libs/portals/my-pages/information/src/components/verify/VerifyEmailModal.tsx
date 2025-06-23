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
import {
  AddEmailMutation,
  useAddEmailMutation,
} from '../emails/ProfileEmailForm/addEmail.mutation.generated'
import { useCreateEmailVerificationMutation } from '../emails/ProfileEmailForm/createEmailVerification.mutation.generated'
import {
  UpdateActorProfileEmailMutation,
  useUpdateActorProfileEmailMutation,
} from '../NotificationSettings/ActorProfileEmails/actorProfileUpdate.mutation.generated'
import {
  UpdateActorProfileEmailWithoutActorMutation,
  useUpdateActorProfileEmailWithoutActorMutation,
} from '../NotificationSettings/ActorProfileEmails/actorProfileUpdateWithoutActor.mutations.generated'
import { useUserInfo } from '@island.is/react-spa/bff'

interface BaseProps {
  type: 'add' | 'update'
  open?: boolean
  email: string
  onClose(): void
  onSuccess?(emailsId: string): void
}

interface AddProps extends BaseProps {
  type: 'add'
  fromNationalId?: never
}

interface UpdateProps extends BaseProps {
  type: 'update'
  fromNationalId: string
}

type VerifyEmailModalProps = AddProps | UpdateProps

export const VerifyEmailModal = ({
  type = 'add',
  open = false,
  onClose,
  email,
  onSuccess,
  fromNationalId,
}: VerifyEmailModalProps) => {
  useNamespaces('sp.settings')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [createEmailVerification, { error: createEmailVerificationError }] =
    useCreateEmailVerificationMutation()

  const [addEmail, { loading: addEmailLoading, error: addEmailError }] =
    useAddEmailMutation({
      onCompleted: (data: AddEmailMutation) => {
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
    onCompleted: (data: UpdateActorProfileEmailMutation) => {
      if (data.updateActorProfileEmail) {
        onClose()
        onSuccess?.(data.updateActorProfileEmail.emailsId)
        client.refetchQueries({
          include: [USER_PROFILE],
        })
      }
    },
  })

  const [
    updateActorProfileEmailWithoutActor,
    { error: updateActorProfileEmailWithoutActorError },
  ] = useUpdateActorProfileEmailWithoutActorMutation({
    onCompleted: (data: UpdateActorProfileEmailWithoutActorMutation) => {
      if (data.updateActorProfileEmailWithoutActor) {
        onClose()
        onSuccess?.(data.updateActorProfileEmailWithoutActor.emailsId)
        client.refetchQueries({
          include: [USER_PROFILE],
        })
      }
    },
  })

  const serverError =
    addEmailError ||
    createEmailVerificationError ||
    updateActorProfileEmailError ||
    updateActorProfileEmailWithoutActorError

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
      const isDelegation = userInfo?.profile?.actor ? true : false

      if (type === 'add') {
        addEmail({
          variables: {
            input,
          },
        })
      } else if (!isDelegation && fromNationalId) {
        updateActorProfileEmailWithoutActor({
          variables: {
            input: {
              email: input.email,
              emailVerificationCode: input.code,
            },
            fromNationalId,
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
    [
      addEmail,
      updateActorProfileEmail,
      type,
      fromNationalId,
      userInfo,
      updateActorProfileEmailWithoutActor,
    ],
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
