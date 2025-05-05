import { Link, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useUserProfile,
  useVerifyEmail,
} from '@island.is/portals/my-pages/graphql'

import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { mVerify as m, mVerify, msg } from '../../../../lib/messages'
import { InformationPaths } from '../../../../lib/paths'
import { Modal } from '../../../Modal/Modal'
import { InputSection } from './components/InputSection'
import { AddEmail, EmailFormValues } from './components/Inputs/AddEmail'
import { VerifyTemplate } from './components/verify/VerifyTemplate/VerifyTemplate'

export const ProfileFormEmail = () => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const [openModal, setOpenModal] = useState(false)

  const onNoCodeReceivedCallback = useCallback(async () => {
    console.log('onNoCodeReceivedCallback')
    // if (email) {
    //   await userProfileService.createVerification({
    //     email,
    //   })
    // }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const onVerifySuccess = () => {
    console.log('onVerifySuccess')
    setOpenModal(true)
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
        <AddEmail onVerifySuccess={onVerifySuccess} />
      </InputSection>
      <Modal isVisible={openModal} onClose={() => setOpenModal(false)}>
        <VerifyTemplate
          title={formatMessage(mVerify.securityCode)}
          intro={intro}
          link={link}
          onNoCodeReceivedCallback={onNoCodeReceivedCallback}
        />
      </Modal>
    </>
  )
}
