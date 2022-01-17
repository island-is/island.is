import React, { useState, useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { m } from '@island.is/service-portal/core'
import {
  ServicePortalModuleComponent,
  Modal,
} from '@island.is/service-portal/core'
import {
  ModalBase,
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
import { EmailFormData } from '../Forms/EmailForm/Steps/FormStep'
import { PhoneFormData } from '../Forms/PhoneForm/Steps/FormStep'
import { parseNumber } from '../../utils/phoneHelper'
import {
  servicePortalCloseOnBoardingModal,
  servicePortalSubmitOnBoardingModal,
} from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { OnboardingHeader } from './components/Header'
import { OnboardingIntro } from './components/Intro'
import { InputSection } from './components/InputSection'
import { InputEmail } from './components/Inputs/Email'
import { InputPhone } from './components/Inputs/Phone'
import { DropModal } from './components/DropModal'
import * as styles from './UserOnboardingModal.css'

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [toggleCloseModal, setToggleCloseModal] = useState(false)

  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [showDropModal, setShowDropModal] = useState<
    'tel' | 'mail' | 'all' | undefined
  >()

  const [telDirty, setTelDirty] = useState(true)
  const [emailDirty, setEmailDirty] = useState(true)

  const { formatMessage } = useLocale()

  const { data: userProfile } = useUserProfile()

  useEffect(() => {
    if (userProfile) {
      if (userProfile.mobilePhoneNumber) {
        const parsedNumber = parseNumber(userProfile.mobilePhoneNumber)
        setTel(parsedNumber)
        setTelDirty(false)
      }
      if (userProfile.email) {
        setEmail(userProfile.email)
        setEmailDirty(false)
      }
    }
  }, [userProfile])

  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { pathname } = useLocation()

  const dropOnboardingSideEffects = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    servicePortalCloseOnBoardingModal(pathname)
    // TODO: Save in db date for reminder to finish in 3 months.
  }

  // Handles a close event directly in the onboarding component
  const dropOnboarding = () => {
    const showAll = !email && !tel && 'all'
    const showEmail = !email && 'mail'
    const showTel = !tel && 'tel'
    const showDropModal = showAll || showEmail || showTel || undefined
    if (showDropModal) {
      setShowDropModal(showDropModal)
    } else {
      setToggleCloseModal(true)
      dropOnboardingSideEffects()
    }
  }

  const closeModal = () => {
    setToggleCloseModal(true)
  }

  const submitFormData = async (email: string, mobilePhoneNumber: string) => {
    try {
      /**
       * TODO:
       * - createIslykillSettings + updateIslykillSettings in islykill.service.ts...
       * ..should check if email + phone is verified before saving in islykill db
       * - /minarsidur/stillingar/personuupplysingar/ -> Update look on this page to new look
       * - Language switcher onboarding overlay
       * - Review styling -> Compare with design.
       */
      if (userProfile) {
        await updateUserProfile({
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
        })
      } else {
        await createUserProfile({
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
        })
      }
      if (pathname) {
        servicePortalSubmitOnBoardingModal(pathname)
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handleFormSubmit = () => {
    submitFormData(email, tel)
    closeModal()
  }

  return (
    <ModalBase
      baseId="user-onboarding-modal"
      toggleClose={toggleCloseModal}
      hideOnClickOutside={false}
      initialVisibility={true}
      className={styles.dialog}
    >
      <GridContainer>
        <GridRow marginBottom={10}>
          <GridColumn span="12/12">
            <OnboardingHeader dropOnboarding={dropOnboarding} />
          </GridColumn>
          <GridColumn span={['12/12', '3/12']}></GridColumn>
          <GridColumn span={['12/12', '5/12']}>
            <OnboardingIntro name={userInfo?.profile?.name || ''} />
            <InputSection
              title={formatMessage(m.email)}
              text="Vinsamlegt settu inn nefangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar."
            >
              <InputEmail
                onCallback={(emailAddr) => setEmail(emailAddr)}
                emailDirty={(isDirty) => setEmailDirty(isDirty)}
                buttonText={formatMessage({
                  id: 'sp.settings:save-email',
                  defaultMessage: 'Vista netfang',
                })}
                email={email}
              />
            </InputSection>
            <InputSection
              title={formatMessage(m.telNumber)}
              text="Við komum til með að senda á þig staðfestinar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar."
            >
              <InputPhone
                onCallback={(mobile) => setTel(mobile)}
                telDirty={(isDirty) => setTelDirty(isDirty)}
                buttonText={formatMessage({
                  id: 'sp.settings:save-tel',
                  defaultMessage: 'Vista símanúmer',
                })}
                mobile={tel}
              />
            </InputSection>
            <Box
              paddingTop={4}
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
            >
              <Button
                icon="checkmark"
                disabled={emailDirty || telDirty || (!tel && !email)}
                onClick={handleFormSubmit}
              >
                {formatMessage(m.saveInfo)}
              </Button>
            </Box>
          </GridColumn>
          <GridColumn className={styles.endGrid} span={['12/12', '4/12']}>
            <img
              src="assets/images/digitalServices.svg"
              width="80%"
              alt="Skrautmynd"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {showDropModal && (
        <DropModal
          type={showDropModal}
          onDrop={closeModal}
          onClose={() => setShowDropModal(undefined)}
          close={false}
        />
      )}
    </ModalBase>
  )
}

export default UserOnboardingModal
