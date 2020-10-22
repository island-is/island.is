import { toast } from '@island.is/island-ui/core'
import { Locale } from '@island.is/localization'
import {
  Modal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useCreateUserProfile } from '@island.is/service-portal/graphql'
import React, { useState } from 'react'
import { EmailFormData } from '../Forms/EmailForm'
import { LanguageFormData, LanguageFormOption } from '../Forms/LanguageForm'
import { PhoneFormData } from '../Forms/PhoneForm'
import { EmailStep } from './Steps/EmailStep'
import { IntroStep } from './Steps/IntroStep'
import { LanguageStep } from './Steps/LanguageStep'
import { PhoneStep } from './Steps/PhoneStep'
import { SubmitFormStep } from './Steps/SubmitFormStep'

type OnboardingStep =
  | 'intro'
  | 'tel-form'
  | 'email-form'
  | 'language-form'
  | 'submit-form'

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<LanguageFormOption | null>(null)
  const { createUserProfile } = useCreateUserProfile(userInfo.profile.natreg)

  const handleCloseModal = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    setIsOpen(false)
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
      await createUserProfile({
        email,
        locale,
        mobilePhoneNumber,
      })

      toast.success('Notendaupplýsingar þínar hafa verið uppfærðar')
      setIsOpen(false)
    } catch (err) {
      gotoStep('language-form')
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handlePhoneStepSubmit = (data: PhoneFormData) => {
    setTel(data.tel)
    gotoStep('email-form')
  }

  const handleEmailStepSubmit = (data: EmailFormData) => {
    setEmail(data.email)
    gotoStep('language-form')
  }

  const handleLanguageStepSubmit = (data: LanguageFormData) => {
    setLanguage(data.language)
    submitFormData(email, tel, data?.language?.value || 'is')
  }

  return (
    <Modal onCloseModal={handleCloseModal} isOpen={isOpen}>
      {step === 'intro' && (
        <IntroStep
          userInfo={userInfo}
          onClose={handleCloseModal}
          onSubmit={gotoStep.bind(null, 'tel-form')}
        />
      )}
      {step === 'tel-form' && (
        <PhoneStep
          onBack={gotoStep.bind(null, 'intro')}
          tel={tel}
          onSubmit={handlePhoneStepSubmit}
        />
      )}
      {step === 'email-form' && (
        <EmailStep
          onBack={gotoStep.bind(null, 'tel-form')}
          email={email}
          onSubmit={handleEmailStepSubmit}
        />
      )}
      {step === 'language-form' && (
        <LanguageStep
          onBack={gotoStep.bind(null, 'email-form')}
          language={language}
          onSubmit={handleLanguageStepSubmit}
        />
      )}
      {step === 'submit-form' && <SubmitFormStep />}
    </Modal>
  )
}

export default UserOnboardingModal
