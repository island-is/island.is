import React, { FC, useState, useEffect } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { GridRow, GridColumn, GridContainer } from '@island.is/island-ui/core'
import { parseNumber, LoadModal } from '@island.is/service-portal/core'
import {
  useUserProfile,
  useUpdateOrCreateUserProfile,
  useDeleteIslykillValue,
} from '@island.is/service-portal/graphql'
import { OnboardingIntro } from './components/Intro'
import { InputSection } from './components/InputSection'
import { InputEmail } from './components/Inputs/Email'
import { InputPhone } from './components/Inputs/Phone'
import { DropModal } from './components/DropModal'
import { BankInfoForm } from './components/Inputs/BankInfoForm'
import { Nudge } from './components/Inputs/Nudge'
import { msg } from '../../../../lib/messages'
import { DropModalType, DataStatus } from './types/form'
import { bankInfoObject } from '../../../../utils/bankInfoHelper'
import { diffModifiedOverMaxDate } from '../../../../utils/showUserOnboardingModal'
import { PaperMail } from './components/Inputs/PaperMail'

import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'

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
  const [showPaperMail, setShowPaperMail] = useState(false)
  const [showDropModal, setShowDropModal] = useState<DropModalType>()
  const { updateOrCreateUserProfile, loading: updateLoading } =
    useUpdateOrCreateUserProfile()
  const { deleteIslykillValue, loading: deleteLoading } =
    useDeleteIslykillValue()

  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()

  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  const { formatMessage } = useLocale()

  /* Should show the paper mail settings? */
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalPaperMailSettingsEnabled`,
        false,
      )
      if (ffEnabled) {
        setShowPaperMail(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
  }, [])

  useEffect(() => {
    const isLoadingForm = updateLoading || deleteLoading
    if (setFormLoading) {
      setFormLoading(isLoadingForm)
    }
  }, [updateLoading, deleteLoading])

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
        migratedUserUpdate()
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

  const migratedUserUpdate = async () => {
    try {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile
      const hasModification = userProfileData?.modified

      const hasEmailNoVerification =
        userProfileData?.emailStatus === DataStatus.NOT_VERIFIED &&
        userProfile?.email
      const hasTelNoVerification =
        userProfileData?.mobileStatus === DataStatus.NOT_VERIFIED &&
        userProfile?.mobilePhoneNumber

      const diffOverMax = diffModifiedOverMaxDate(userProfileData?.modified)

      // If user is migrating. Then process migration, else close modal without action.
      if (
        ((hasEmailNoVerification || hasTelNoVerification) &&
          !hasModification) ||
        diffOverMax
      ) {
        /**
         * If email is present in data, but has status of 'NOT_VERIFIED',
         * And the user has no modification date in the userprofile data,
         * This implies a MIGRATED user. Therefore set the status to 'VERIFIED',
         * After asking the user to verify the data themselves.
         */
        await updateOrCreateUserProfile({
          ...(hasEmailNoVerification && { emailStatus: DataStatus.VERIFIED }),
          ...(hasTelNoVerification && { mobileStatus: DataStatus.VERIFIED }),
        }).then(() => closeAllModals())
      } else {
        closeAllModals()
      }
    } catch {
      // do nothing
      closeAllModals()
    }
  }

  const submitEmptyEmailAndTel = async () => {
    try {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile
      const hasModification = userProfileData?.modified

      const emptyProfile = userProfileData === null || !hasModification
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
        await migratedUserUpdate()
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
            {!userLoading && (
              <InputEmail
                buttonText={formatMessage(msg.saveEmail)}
                email={userProfile?.email || ''}
                emailDirty={(isDirty) => setEmailDirty(isDirty)}
                disabled={updateLoading || deleteLoading}
              />
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
                    typeof userProfile?.canNudge === 'boolean'
                      ? !userProfile.canNudge
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
            {!userLoading && (
              <InputPhone
                buttonText={formatMessage(msg.saveTel)}
                mobile={parseNumber(userProfile?.mobilePhoneNumber || '')}
                telDirty={(isDirty) => setTelDirty(isDirty)}
                disabled={updateLoading || deleteLoading}
              />
            )}
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
          {showDetails && showPaperMail && (
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
              loading={updateLoading || deleteLoading || userLoading}
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
