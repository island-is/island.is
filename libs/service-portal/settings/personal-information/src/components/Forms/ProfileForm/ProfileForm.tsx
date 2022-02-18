import React, { FC, useState, useEffect } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { GridRow, GridColumn, GridContainer } from '@island.is/island-ui/core'
import { parseNumber } from '../../../utils/phoneHelper'
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
import { msg } from '../../../lib/messages'
import { DropModalType, DataStatus } from './types/form'
import { bankInfoObject } from '../../../utils/bankInfoHelper'

interface Props {
  onCloseOverlay?: () => void
  onCloseDropModal?: () => void
  canDrop?: boolean
  title: string
  showDetails?: boolean
}

export const ProfileForm: FC<Props> = ({
  onCloseOverlay,
  onCloseDropModal,
  canDrop,
  title,
  showDetails,
}) => {
  useNamespaces('sp.settings')
  const [telDirty, setTelDirty] = useState(true)
  const [emailDirty, setEmailDirty] = useState(true)
  const [showDropModal, setShowDropModal] = useState<DropModalType>()
  const { updateOrCreateUserProfile } = useUpdateOrCreateUserProfile()
  const { deleteIslykillValue } = useDeleteIslykillValue()

  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()

  const { formatMessage } = useLocale()

  useEffect(() => {
    if (canDrop && onCloseOverlay) {
      const showAll = emailDirty && telDirty && 'all'
      const showEmail = emailDirty && 'mail'
      const showTel = telDirty && 'tel'
      const showDropModal = showAll || showEmail || showTel || undefined
      if (showDropModal) {
        setShowDropModal(showDropModal)
      } else {
        migratedUserUpdate()
      }
    }
  }, [canDrop])

  const migratedUserUpdate = async () => {
    if (onCloseOverlay) {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile
      const hasModification = userProfileData?.modified

      const hasEmailNoVerification =
        userProfileData?.emailStatus === DataStatus.NOT_VERIFIED &&
        userProfile?.email
      const hasTelNoVerification =
        userProfileData?.mobileStatus === DataStatus.NOT_VERIFIED &&
        userProfile?.mobilePhoneNumber

      // If user is migrating. Then process migration, else close modal without action.
      if (
        (hasEmailNoVerification || hasTelNoVerification) &&
        !hasModification
      ) {
        try {
          /**
           * If email is present in data, but has status of 'NOT_VERIFIED',
           * And the user has no modification date in the userprofile data,
           * This implies a MIGRATED user. Therefore set the status to 'VERIFIED',
           * After asking the user to verify the data themselves.
           */
          await updateOrCreateUserProfile({
            ...(hasEmailNoVerification && { emailStatus: DataStatus.VERIFIED }),
            ...(hasTelNoVerification && { mobileStatus: DataStatus.VERIFIED }),
          }).then(() => onCloseOverlay())
        } catch {
          // do nothing
          onCloseOverlay()
        }
      } else {
        console.log('JUST CLOSE IT MIGRATE')
        onCloseOverlay()
      }
    }
  }

  const submitEmptyEmailAndTel = async () => {
    if (onCloseOverlay) {
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
        try {
          await deleteIslykillValue({
            email: true,
            mobilePhoneNumber: true,
          }).then(() => onCloseOverlay())
        } catch {
          // do nothing
          onCloseOverlay()
        }
      } else {
        console.log('JUST CLOSE IT EMPTY')
        onCloseOverlay()
      }
    }
  }

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
          <OnboardingIntro name={title || ''} />
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
              />
            )}
          </InputSection>
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
          {showDetails && (
            <InputSection
              title={formatMessage(m.nudge)}
              loading={userLoading}
              text={formatMessage(msg.editNudgeText)}
            >
              {!userLoading && <Nudge canNudge={!!userProfile?.canNudge} />}
            </InputSection>
          )}
          {showDropModal && onCloseOverlay && (
            <DropModal
              type={showDropModal}
              onDrop={submitEmptyEmailAndTel}
              onClose={() => {
                onCloseDropModal && onCloseDropModal()
                setShowDropModal(undefined)
              }}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ProfileForm
