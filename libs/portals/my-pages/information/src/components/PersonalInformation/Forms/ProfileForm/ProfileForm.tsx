import React, { FC, useEffect, useState } from 'react'

import {
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  PhoneInput,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LoadModal, m, parseNumber } from '@island.is/portals/my-pages/core'
import {
  useDeleteIslykillValue,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'

import { useUserInfo } from '@island.is/react-spa/bff'
import { msg } from '../../../../lib/messages'
import { bankInfoObject } from '../../../../utils/bankInfoHelper'
import { DropModal } from './components/DropModal'
import { InputSection } from './components/InputSection'
import { BankInfoForm } from './components/Inputs/BankInfoForm'
import { InputEmail } from './components/Inputs/Email'
import { Nudge } from './components/Inputs/Nudge'
import { PaperMail } from './components/Inputs/PaperMail'
import { InputPhone } from './components/Inputs/Phone'
import { ReadOnlyWithLinks } from './components/Inputs/ReadOnlyWithLinks'
import { OnboardingIntro } from './components/Intro'
import { useConfirmNudgeMutation } from './confirmNudge.generated'
import { DropModalType } from './types/form'

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
  const [telDirty, setTelDirty] = useState(true)
  const [emailDirty, setEmailDirty] = useState(true)
  const [internalLoading, setInternalLoading] = useState(false)
  const [showDropModal, setShowDropModal] = useState<DropModalType>()
  const { deleteIslykillValue, loading: deleteLoading } =
    useDeleteIslykillValue()
  const userInfo = useUserInfo()
  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const { formatMessage } = useLocale()
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
      const showAll = emailDirty && telDirty && 'all'
      const showEmail = emailDirty && 'mail'
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

  const submitEmptyEmailAndTel = async () => {
    try {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile

      const emptyProfile =
        !userProfileData || userProfileData.needsNudge === null
      if (emptyProfile && emailDirty && telDirty) {
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
      if (emailDirty && telDirty) {
        await submitEmptyEmailAndTel()
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
            title={formatMessage(m.email)}
            text={formatMessage(msg.editEmailText)}
            loading={userLoading}
          >
            {!userLoading &&
              (!isCompany ? (
                <ReadOnlyWithLinks
                  input={
                    <Input
                      name="email"
                      placeholder={formatMessage(msg.email)}
                      value={userProfile?.email || ''}
                      size="xs"
                      label={formatMessage(msg.email)}
                      readOnly
                      {...(userProfile?.emailVerified && {
                        icon: { name: 'checkmark' },
                      })}
                    />
                  }
                  link={{
                    href: getIDSLink(IdsUserProfileLinks.EMAIL),
                    title: formatMessage(
                      userProfile?.email ? msg.change : msg.add,
                    ),
                  }}
                />
              ) : (
                <InputEmail
                  buttonText={formatMessage(msg.saveEmail)}
                  email={userProfile?.email || ''}
                  emailDirty={(isDirty) => setEmailDirty(isDirty)}
                  emailVerified={userProfile?.emailVerified}
                  disabled={deleteLoading}
                />
              ))}
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
                <ReadOnlyWithLinks
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
