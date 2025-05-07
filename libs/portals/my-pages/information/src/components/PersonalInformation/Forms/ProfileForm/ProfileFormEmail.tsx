import { Link, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { mVerify as m, mVerify, msg } from '../../../../lib/messages'
import { InformationPaths } from '../../../../lib/paths'
import { Modal } from '../../../Modal/Modal'
import { InputSection } from './components/InputSection'
import { AddEmail } from './components/Inputs/AddEmail'
import {
  VerifyTemplate,
  VerifyTemplateInput,
} from './components/verify/VerifyTemplate/VerifyTemplate'
import { useCreateEmailVerificationMutation } from './createEmailVerification.mutation.generated'
import { useAddEmailMutation } from './addEmail.mutation.generated'

export const ProfileFormEmail = () => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [createEmailVerification, { data, loading, error }] =
    useCreateEmailVerificationMutation()

  const [
    addEmail,
    { data: addEmailData, loading: addEmailLoading, error: addEmailError },
  ] = useAddEmailMutation()

  const verifyEmail = (email: string) =>
    createEmailVerification({
      variables: {
        input: {
          email,
        },
      },
    })

  const onNoCodeReceivedCallback = useCallback(async () => {
    if (email) {
      await verifyEmail(email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const link = useMemo(
    () => ({
      label: formatMessage(m.cancel),
      onClick: () => setOpenModal(false),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const intro = useMemo(
    () =>
      formatMessage(mVerify.securityCodeEmailIntro, {
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
  }, [data?.createEmailVerification, setOpenModal])

  useEffect(() => {
    if (addEmailData) {
      setOpenModal(false)
      toast.success(formatMessage(mVerify.addEmailSuccess))
    }
  }, [addEmailData, formatMessage])

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

  const onAddEmail = (email: string) => {
    setEmail(email)
    verifyEmail(email)
  }

  return (
    <>
      <InputSection
        title={formatMessage(msg.emails)}
        text={
          <FormattedMessage
            {...msg.emailListText}
            values={{
              link: (
                <Link
                  color="blue400"
                  href={InformationPaths.Notifications}
                  underlineVisibility="always"
                  underline="small"
                >
                  {formatMessage(msg.emailListTextLink)}
                </Link>
              ),
            }}
          />
        }
      >
        <AddEmail onAddEmail={onAddEmail} loading={loading} error={!!error} />
      </InputSection>
      <Modal
        isVisible={openModal && !!email}
        onClose={() => setOpenModal(false)}
      >
        {email && (
          <VerifyTemplate
            loading={addEmailLoading}
            serverError={addEmailError}
            email={email}
            title={formatMessage(mVerify.securityCode)}
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
