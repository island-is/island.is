import { toast } from '@island.is/island-ui/core'
import {
  Modal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import React, { useState } from 'react'
import { FormStep } from './Steps/FormStep'
import { IntroStep } from './Steps/IntroStep'

type OnboardingStep = 'intro' | 'user-info'

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [step, setStep] = useState<OnboardingStep>('intro')

  const handleCloseModal = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    setIsOpen(false)
  }

  const gotoStep = (step: OnboardingStep) => {
    setStep(step)
  }

  const handleFormSubmit = () => {
    toast.success('Notendaupplýsingar þínar hafa verið uppfærðar')
    setIsOpen(false)
  }

  return (
    <Modal onCloseModal={handleCloseModal} isOpen={isOpen}>
      {step === 'intro' && (
        <IntroStep
          userInfo={userInfo}
          onClose={handleCloseModal}
          onSubmit={gotoStep.bind(null, 'user-info')}
        />
      )}
      {step === 'user-info' && (
        <FormStep
          userInfo={userInfo}
          onBack={gotoStep.bind(null, 'intro')}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </Modal>
  )
}

export default UserOnboardingModal
