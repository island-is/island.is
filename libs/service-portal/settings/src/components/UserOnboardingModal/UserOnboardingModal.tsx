import { toast } from '@island.is/island-ui/core'
import { Locale } from '@island.is/localization'
import {
  Modal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  useCreateUserProfile,
  useVerifySms,
} from '@island.is/service-portal/graphql'
import React, { useState } from 'react'
import { EmailFormData } from '../Forms/EmailForm'
import { LanguageFormData, LanguageFormOption } from '../Forms/LanguageForm'
import { PhoneConfirmFormData } from '../Forms/PhoneConfirmForm'
import { PhoneFormData } from '../Forms/PhoneForm'
import { EmailStep } from './Steps/EmailStep'
import { IntroStep } from './Steps/IntroStep'
import { LanguageStep } from './Steps/LanguageStep'
import { PhoneStep } from './Steps/PhoneStep'
import { PhoneConfirmationStep } from './Steps/PhoneConfirmationStep'
import { SubmitFormStep } from './Steps/SubmitFormStep'

type OnboardingStep =
  | 'intro'
  | 'tel-form'
  | 'tel-confirm-form'
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
  const {
    createSmsVerification,
    createLoading,
    confirmSmsVerification,
    confirmLoading,
  } = useVerifySms(userInfo.profile.natreg)

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

  const handlePhoneStepSubmit = async (data: PhoneFormData) => {
    setTel(data.tel)
    try {
      const response = await createSmsVerification({
        mobilePhoneNumber: data.tel,
      })
      if (response.data?.createSmsVerification?.created) {
        gotoStep('tel-confirm-form')
      } else {
        toast.error(
          'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
        )
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handlePhoneConfirmStepSubmit = async (data: PhoneConfirmFormData) => {
    try {
      const response = await confirmSmsVerification({
        code: data.code,
      })
      if (response.data?.confirmSmsVerification?.confirmed) {
        gotoStep('email-form')
      } else {
        toast.error('Rangur kóði')
      }
    } catch (err) {
      toast.error('Rangur kóði')
      gotoStep('tel-form')
    }
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
          loading={createLoading}
          tel={tel}
          onSubmit={handlePhoneStepSubmit}
        />
      )}
      {step === 'tel-confirm-form' && (
        <PhoneConfirmationStep
          onBack={gotoStep.bind(null, 'tel-form')}
          loading={confirmLoading}
          tel={tel}
          onSubmit={handlePhoneConfirmStepSubmit}
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
