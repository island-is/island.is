import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FirstStep from '../../components/PatientDataPermit/FirstStep'
import SecondStep from '../../components/PatientDataPermit/SecondStep'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import ThirdStep from '../../components/PatientDataPermit/ThirdStep'

const NewPermit: React.FC = () => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<number | undefined>(1)
  const navigate = useNavigate()

  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermitTitle)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
    >
      {step === 1 && <FirstStep onClick={() => setStep(2)} />}
      {step === 2 && (
        <SecondStep onClick={() => setStep(3)} goBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <ThirdStep
          goBack={() => setStep(2)}
          onClick={() => navigate(HealthPaths.HealthPatientDataPermits)}
        />
      )}
      {step === undefined && (
        <Problem title={formatMessage(messages.errorTryAgain)} />
      )}
    </IntroWrapper>
  )
}

export default NewPermit
