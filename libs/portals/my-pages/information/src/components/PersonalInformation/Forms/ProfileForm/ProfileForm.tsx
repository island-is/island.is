import React, { FC, useEffect, useState } from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  PhoneInput,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LoadModal, m, parseNumber } from '@island.is/portals/my-pages/core'
import {
  useDeleteIslykillValue,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'

import { useUserInfo } from '@island.is/react-spa/bff'
import { FormattedMessage } from 'react-intl'
import { emailsMsg, msg } from '../../../../lib/messages'
import { InformationPaths } from '../../../../lib/paths'
import { bankInfoObject } from '../../../../utils/bankInfoHelper'
import { ProfileEmailForm } from '../../../emails/ProfileEmailForm/ProfileEmailForm'
import { DropModal } from './components/DropModal'
import { InputSection } from './components/InputSection'
import { BankInfoForm } from './components/Inputs/BankInfoForm'
import { Nudge } from './components/Inputs/Nudge'
import { PaperMail } from './components/Inputs/PaperMail'
import { InputPhone } from './components/Inputs/Phone'
import { WithLinkWrapper } from './components/Inputs/WithLinkWrapper'
import { OnboardingIntro } from './components/Intro'
import { useConfirmNudgeMutation } from './confirmNudge.generated'
import { DropModalType } from './types/form'
import { EmailsList } from '../../../emails/EmailsList/EmailsList'

enum IdsUserProfileLinks {
  EMAIL = '/app/user-profile/email',
  PHONE_NUMBER = '/app/user-profile/phone',
}

interface Props {
  onCloseOverlay?: () => void
  onCloseDropModal?: () => void
  canDrop?: boolean
  title: string
  showDetails?: boolean
  showIntroTitle?: boolean
  showIntroText?: boolean
  setFormLoading?: (isLoading: boolean) => void
}

export const ProfileForm: FC<React.PropsWithChildren<Props>> = ({
  onCloseOverlay,
  onCloseDropModal,
  canDrop,
  title,
  showDetails,
  setFormLoading,
  showIntroTitle,
  showIntroText = true,
}) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const [telDirty, setTelDirty] = useState(true)
  const [internalLoading, setInternalLoading] = useState(false)
  const [showDropModal, setShowDropModal] = useState<DropModalType>()
  const [showEmailForm, setShowEmailForm] = useState(false)

  const { deleteIslykillValue, loading: deleteLoading } =
    useDeleteIslykillValue()
  const userInfo = useUserInfo()
  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()

  // Filter out emails that are not set
  const emails = userProfile?.emails?.filter((item) => item.email) ?? []

  const [confirmNudge] = useConfirmNudgeMutation()
  const isCompany = userInfo?.profile?.subjectType === 'legalEntity'

  /**
   * Creates a link to the IDS user profile page.
   * By setting the state to update, the user will exit the onboarding process after updating the desired field.
   */
  const getIDSLink = (linkPath: IdsUserProfileLinks) => {
    return `${
      userInfo.profile.iss
    }${linkPath}?state=update&returnUrl=${encodeURIComponent(
      window.location.toString(),
    )}`
  }

  useEffect(() => {
    if (setFormLoading) {
      setFormLoading(deleteLoading)
    }
  }, [deleteLoading])

  useEffect(() => {
    if (canDrop && onCloseOverlay) {
      const showAll = telDirty && 'all'
      const showEmail = 'mail'
      const showTel = telDirty && 'tel'
      const showDropModal = showAll || showEmail || showTel || undefined
      if (showDropModal) {
        setShowDropModal(showDropModal)
      } else {
        setInternalLoading(true)
        confirmNudge().then(() => closeAllModals())
      }
    }
  }, [canDrop])

  const closeAllModals = () => {
    if (onCloseOverlay && setFormLoading) {
      onCloseOverlay()
      setInternalLoading(false)
      setFormLoading(false)
    }
  }

  const submitEmptyTel = async () => {
    try {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile

      const emptyProfile =
        !userProfileData || userProfileData.needsNudge === null
      if (emptyProfile && telDirty) {
        /**
         * If the user has no email or tel data, and the inputs are empty,
         * We will save the email and mobilePhoneNumber as undefined
         * With a status of 'EMPTY'. This implies empty values by the user's choice.
         * After asking the user to verify that they are updating their profile with empty fields.
         */

        await deleteIslykillValue({
          email: true,
          mobilePhoneNumber: true,
        }).then(() => closeAllModals())
      } else {
        closeAllModals()
      }
    } catch {
      // do nothing
      closeAllModals()
    }
  }

  const dropSideEffects = async () => {
    try {
      if (setFormLoading) {
        setFormLoading(true)
        setInternalLoading(true)
      }
      if (telDirty) {
        await submitEmptyTel()
      } else {
        await confirmNudge().then(() => closeAllModals())
      }
    } catch (e) {
      closeAllModals()
    }
  }

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
          <OnboardingIntro
            name={title || ''}
            showIntroTitle={showIntroTitle}
            showIntroText={showIntroText}
          />

          <InputSection
            title={formatMessage(emailsMsg.emails)}
            text={
              <FormattedMessage
                {...emailsMsg.emailListText}
                values={{
                  link: (
                    <Link
                      color="blue400"
                      href={InformationPaths.Notifications}
                      underlineVisibility="always"
                      underline="small"
                    >
                      {formatMessage(emailsMsg.emailListTextLink)}
                    </Link>
                  ),
                }}
              />
            }
          >
            {userLoading && emails ? (
              <SkeletonLoader
                repeat={3}
                height={80}
                space={2}
                borderRadius="large"
              />
            ) : (
              <Box display="flex" flexDirection="column" rowGap={2}>
                {emails.length > 0 && <EmailsList items={emails} />}
                {emails.length === 0 || showEmailForm ? (
                  <ProfileEmailForm />
                ) : (
                  <Box marginTop={1}>
                    <Button
                      variant="text"
                      size="small"
                      icon="add"
                      onClick={() => setShowEmailForm(true)}
                    >
                      {formatMessage(emailsMsg.addEmail)}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </InputSection>

          {showDetails && (
            <InputSection
              title={formatMessage(m.refuseEmailTitle)}
              loading={userLoading}
              text={formatMessage(msg.editNudgeText)}
            >
              {!userLoading && (
                <Nudge
                  refuseMail={
                    /**
                     * This checkbox block is being displayed as the opposite of canNudge.
                     * Details inside <Nudge />
                     */
                    typeof userProfile?.emailNotifications === 'boolean'
                      ? !userProfile.emailNotifications
                      : true
                  }
                />
              )}
            </InputSection>
          )}
          <InputSection
            title={formatMessage(m.telNumber)}
            text={formatMessage(msg.editTelText)}
            loading={userLoading}
          >
            {!userLoading &&
              (!isCompany ? (
                <WithLinkWrapper
                  input={
                    <PhoneInput
                      name="phoneNumber"
                      label={formatMessage(msg.tel)}
                      placeholder="000-0000"
                      value={parseNumber(userProfile?.mobilePhoneNumber || '')}
                      size="xs"
                      readOnly
                      {...(userProfile?.mobilePhoneNumberVerified && {
                        icon: { name: 'checkmark' },
                      })}
                    />
                  }
                  link={{
                    href: getIDSLink(IdsUserProfileLinks.PHONE_NUMBER),
                    title: formatMessage(
                      userProfile?.mobilePhoneNumber ? msg.change : msg.add,
                    ),
                  }}
                />
              ) : (
                <InputPhone
                  buttonText={formatMessage(msg.saveTel)}
                  mobile={parseNumber(userProfile?.mobilePhoneNumber || '')}
                  telVerified={userProfile?.mobilePhoneNumberVerified}
                  telDirty={(isDirty) => setTelDirty(isDirty)}
                  disabled={deleteLoading}
                />
              ))}
          </InputSection>
          {showDetails && (
            <InputSection
              title={formatMessage(m.bankAccountInfo)}
              text={formatMessage(msg.editBankInfoText)}
              loading={userLoading}
            >
              {!userLoading && (
                <BankInfoForm
                  bankInfo={bankInfoObject(userProfile?.bankInfo || '')}
                />
              )}
            </InputSection>
          )}
          {showDetails && (
            <InputSection
              title={formatMessage(m.requestPaperMailTitle)}
              loading={userLoading}
              text={formatMessage(msg.editPaperMailText)}
            >
              {!userLoading && <PaperMail />}
            </InputSection>
          )}
          {showDropModal && onCloseOverlay && !internalLoading && (
            <DropModal
              type={showDropModal}
              onDrop={dropSideEffects}
              loading={deleteLoading || userLoading}
              onClose={() => {
                onCloseDropModal && onCloseDropModal()
                setShowDropModal(undefined)
              }}
            />
          )}
          {internalLoading && <LoadModal />}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ProfileForm
