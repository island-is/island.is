import React, { FC, useState, useEffect } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { GridRow, GridColumn, GridContainer } from '@island.is/island-ui/core'
import { parseNumber } from '../../../utils/phoneHelper'
import {
  useUserProfile,
  useUpdateOrCreateUserProfile,
} from '@island.is/service-portal/graphql'
import { OnboardingIntro } from './components/Intro'
import { InputSection } from './components/InputSection'
import { InputEmail } from './components/Inputs/Email'
import { InputPhone } from './components/Inputs/Phone'
import { DropModal } from './components/DropModal'
import { BankInfoForm } from './components/Inputs/BankInfoForm'
import { Nudge } from './components/Inputs/Nudge'
import { DropModalType } from './types/form'
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

  const { data: userProfile, loading: userLoading } = useUserProfile()

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
        if (emailDirty || telDirty) {
          submitEmptyStatus({ email: emailDirty, tel: telDirty }).then(() =>
            onCloseOverlay(),
          )
        } else {
          onCloseOverlay()
        }
      }
    }
  }, [canDrop])

  const submitEmptyStatus = async (emptyStatus: {
    email: boolean
    tel: boolean
  }) => {
    if (emptyStatus.email || emptyStatus.tel) {
      try {
        await updateOrCreateUserProfile({
          ...(emptyStatus.email && { emailStatus: 'EMPTY' }),
          ...(emptyStatus.tel && { mobileStatus: 'EMPTY' }),
        })
      } catch {
        // do nothing
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
            text="Vinsamlega settu inn netfangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar."
            loading={userLoading}
          >
            {!userLoading && (
              <InputEmail
                buttonText={formatMessage({
                  id: 'sp.settings:save-email',
                  defaultMessage: 'Vista netfang',
                })}
                email={userProfile?.email || ''}
                emailDirty={(isDirty) => setEmailDirty(isDirty)}
              />
            )}
          </InputSection>
          <InputSection
            title={formatMessage(m.telNumber)}
            text="Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar."
            loading={userLoading}
          >
            {!userLoading && (
              <InputPhone
                buttonText={formatMessage({
                  id: 'sp.settings:save-tel',
                  defaultMessage: 'Vista símanúmer',
                })}
                mobile={parseNumber(userProfile?.mobilePhoneNumber || '')}
                telDirty={(isDirty) => setTelDirty(isDirty)}
              />
            )}
          </InputSection>
          {showDetails && (
            <InputSection
              title={formatMessage(m.bankAccountInfo)}
              text={formatMessage({
                id: 'sp.settings:edit-bankInfo-description',
                defaultMessage: `
                  Hér getur þú gert breytingar á þeim bankareikningi
                  sem þú vilt nota í kerfum island.is.
                `,
              })}
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
              text={formatMessage({
                id: 'sp.settings:edit-nudge-description',
                defaultMessage: `
                    Hér getur þú gert breytingar á hnipp möguleikum. 
                    Hnipp stillingar segja til um hvort þú viljir að Island.is láti 
                    þig vita þegar eitthvað markvert gerist.
                  `,
              })}
            >
              {!userLoading && <Nudge canNudge={!!userProfile?.canNudge} />}
            </InputSection>
          )}
          {showDropModal && onCloseOverlay && (
            <DropModal
              type={showDropModal}
              onDrop={onCloseOverlay}
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
