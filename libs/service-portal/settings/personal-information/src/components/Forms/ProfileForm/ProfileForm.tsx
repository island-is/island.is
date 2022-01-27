import React, { FC, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import {
  Box,
  GridRow,
  GridColumn,
  GridContainer,
  Button,
} from '@island.is/island-ui/core'
import {
  useCreateUserProfile,
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { parseNumber } from '../../../utils/phoneHelper'
import { formatBankInfo } from '../../../utils/bankInfoHelper'
import { servicePortalSubmitOnBoardingModal } from '@island.is/plausible'
import { OnboardingIntro } from './components/Intro'
import { InputSection } from './components/InputSection'
import { InputEmail } from './components/Inputs/Email'
import { InputPhone } from './components/Inputs/Phone'
import { DropModal } from './components/DropModal'
import { BankInfoForm } from '../BankInfoForm'
import { Nudge } from './components/Inputs/Nudge'
import { FormValues } from './types/form'
import { useForm } from 'react-hook-form'
import * as styles from './ProfileForm.css'

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
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [bankInfo, setBankInfo] = useState('')

  const { data: userProfile, loading: userLoading } = useUserProfile()

  const hookFormData = useForm({
    defaultValues: {
      email: '',
      tel: '',
      bankInfo: '',
      nudge: false,
    },
  })

  const { handleSubmit, getValues, reset } = hookFormData

  useEffect(() => {
    reset({
      email: userProfile?.email || '',
      tel: parseNumber(userProfile?.mobilePhoneNumber || ''),
      ...(showDetails && {
        bankInfo: userProfile?.bankInfo || '',
        nudge: !!userProfile?.canNudge,
      }),
    })
  }, [userProfile])

  const [showDropModal, setShowDropModal] = useState<
    'tel' | 'mail' | 'all' | undefined
  >()

  const { formatMessage } = useLocale()

  useEffect(() => {
    if (userProfile) {
      if (userProfile.mobilePhoneNumber) {
        const parsedNumber = parseNumber(userProfile.mobilePhoneNumber)
        setTel(parsedNumber)
      }
      if (userProfile.email) {
        setEmail(userProfile.email)
      }
      if (userProfile.bankInfo) {
        setBankInfo(userProfile.bankInfo)
      }
    }
  }, [userProfile])

  useEffect(() => {
    if (canDrop && onCloseOverlay) {
      const showAll = !email && !tel && 'all'
      const showEmail = !email && 'mail'
      const showTel = !tel && 'tel'
      const showDropModal = showAll || showEmail || showTel || undefined
      if (showDropModal) {
        setShowDropModal(showDropModal)
      } else {
        onCloseOverlay()
      }
    }
  }, [canDrop])

  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { pathname } = useLocation()

  const submitFormData = async (data: FormValues) => {
    try {
      if (userProfile) {
        await updateUserProfile({
          ...data,
        })
      } else {
        await createUserProfile({
          ...data,
        })
      }
      if (pathname && !showDetails) {
        servicePortalSubmitOnBoardingModal(pathname)
      }
    } catch (err) {
      // TODO: REMOVE TOAST. PUT FORM ERROR INSTEAD.
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  console.log(
    'userProfileuserProfileuserProfileuserProfileuserProfile',
    userProfile,
  )

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '9/12']}>
          <OnboardingIntro name={title || ''} />
          <form onSubmit={handleSubmit(submitFormData)}>
            <InputSection
              title={formatMessage(m.email)}
              text="Vinsamlega settu inn netfangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar."
              loading={userLoading}
            >
              <InputEmail
                buttonText={formatMessage({
                  id: 'sp.settings:save-email',
                  defaultMessage: 'Vista netfang',
                })}
                email={email}
                hookFormData={hookFormData}
                onValid={(val) => {
                  submitFormData({ email: val })
                  setEmail(val)
                }}
              />
            </InputSection>
            <InputSection
              title={formatMessage(m.telNumber)}
              text="Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar."
              loading={userLoading}
            >
              <InputPhone
                buttonText={formatMessage({
                  id: 'sp.settings:save-tel',
                  defaultMessage: 'Vista símanúmer',
                })}
                mobile={tel}
                hookFormData={hookFormData}
                onValid={(val) => {
                  submitFormData({ tel: val })
                  setTel(val)
                }}
              />
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
                <BankInfoForm
                  onSave={(val) => submitFormData({ bankInfo: val })}
                  bankInfo={bankInfo}
                  hookFormData={hookFormData}
                />
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
                <Nudge
                  onSave={(val) => submitFormData({ canNudge: val })}
                  hookFormData={hookFormData}
                />
              </InputSection>
            )}
          </form>
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
