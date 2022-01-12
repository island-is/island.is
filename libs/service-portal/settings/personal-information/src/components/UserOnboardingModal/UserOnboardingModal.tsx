import React, { useState, useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { defaultLanguage } from '@island.is/shared/constants'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
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
import { LanguageFormData, LanguageFormOption } from '../Forms/LanguageForm'
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
import * as styles from './UserOnboardingModal.css'

export type OnboardingStep =
  | 'intro'
  | 'language-form'
  | 'tel-form'
  | 'email-form'
  | 'submit-form'
  | 'form-submitted'
  | '00'

const defaultLanguageOption: LanguageFormOption = {
  value: 'is',
  label: 'Íslenska',
}

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const [step, setStep] = useState<OnboardingStep>('00')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<LanguageFormOption | null>(
    defaultLanguageOption,
  )

  const { data: userProfile } = useUserProfile()

  useEffect(() => {
    if (userProfile) {
      if (userProfile.mobilePhoneNumber) {
        const parsedNumber = parseNumber(userProfile.mobilePhoneNumber)
        setTel(parsedNumber)
      }
      if (userProfile.email) {
        setEmail(userProfile.email)
      }
      if (userProfile.locale) {
        const enOption: LanguageFormOption = {
          value: 'en',
          label: 'English',
        }
        const lang =
          userProfile.locale === 'en' ? enOption : defaultLanguageOption
        setLanguage(lang)
      }
    }
  }, [userProfile])

  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { changeLanguage } = useNamespaces()
  const { pathname } = useLocation()

  // On close side effects
  const dropOnboardingSideEffects = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    servicePortalCloseOnBoardingModal(pathname)
    // TODO: Save in db date for reminder to finish in 3 months.
  }

  // Handles a close event directly in the onboarding component
  const dropOnboarding = () => {
    setToggleCloseModal(true)
    dropOnboardingSideEffects()
  }

  const closeModal = () => {
    setToggleCloseModal(true)
  }

  const gotoStep = (step: OnboardingStep) => {
    setStep(step)
  }

  const submitFormData = async (
    email: string,
    mobilePhoneNumber: string,
    locale: Locale,
  ) => {
    gotoStep('submit-form')

    try {
      if (userProfile) {
        await updateUserProfile({
          locale,
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
        })
      } else {
        await createUserProfile({
          locale,
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
        })
      }
      gotoStep('form-submitted')
      if (pathname) {
        servicePortalSubmitOnBoardingModal(pathname)
      }
    } catch (err) {
      gotoStep('email-form')
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handleLanguageStepSubmit = (data: LanguageFormData) => {
    if (data.language === null) return
    setLanguage(data.language)
    changeLanguage(data.language.value)
    gotoStep('tel-form')
  }

  const handlePhoneStepSubmit = (data: PhoneFormData) => {
    setTel(data.tel)
    gotoStep('email-form')
  }

  const handleEmailStepSubmit = (data: EmailFormData) => {
    setEmail(data.email)
    submitFormData(data.email, tel, language?.value || defaultLanguage)
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
              title={'Tölvupóstur'}
              text="Vinsamlegt settu inn nefangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar."
            >
              <InputEmail buttonText="Vista netfang" />
            </InputSection>
            {/* <InputSection
              title={'Símanúmer'}
              text="Við komum til með að senda á þig staðfestinar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar."
            >
              <InputEmail buttonText="Vista símanúmer" />
            </InputSection> */}
            <Box
              paddingTop={4}
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
            >
              <Button
                icon="checkmark"
                disabled
                onClick={() => console.log('save email')}
              >
                Vista upplýsingar
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
    </ModalBase>
  )
}

export default UserOnboardingModal
