import { Text, toast } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { User } from 'oidc-client'
import React, { FC, useState } from 'react'
import { IntroStep } from './Steps/IntroStep'

type OnboardingStep = 'intro' | 'user-info' | 'submit'

interface Props {
  userInfo: User
}

export const UserOnboardingModal: FC<Props> = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [step, setStep] = useState<OnboardingStep>('intro')

  const handleCloseModal = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    setIsOpen(false)
  }

  const onStepSubmit = (step: OnboardingStep) => {
    console.log('continue')
  }

  return (
    <Modal onCloseModal={handleCloseModal} isOpen={isOpen}>
      {step === 'intro' && (
        <IntroStep
          userInfo={userInfo}
          onClose={handleCloseModal}
          onSubmit={onStepSubmit.bind(null, 'intro')}
        />
      )}
    </Modal>
  )
}
