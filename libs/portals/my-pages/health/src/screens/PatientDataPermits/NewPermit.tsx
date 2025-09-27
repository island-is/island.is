import {
  HealthDirectoratePatientDataPermitInput,
  HealthDirectoratePermitCodes,
} from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useCreatePatientDataPermitMutation } from './PatientDataPermits.generated'
import ThirdStep from '../../components/PatientDataPermit/ThirdStep'
import SecondStep from '../../components/PatientDataPermit/SecondStep'
import FirstStep from '../../components/PatientDataPermit/FirstStep'

const DEFAULT_STEP = 1 // Default to step 1 to start with the first step

const NewPermit: React.FC = () => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<number | undefined>(DEFAULT_STEP)
  const [formState, setFormState] =
    useState<HealthDirectoratePatientDataPermitInput>()

  const navigate = useNavigate()

  const [createPermit] = useCreatePatientDataPermitMutation()

  const handleSubmit = () => {
    if (formState) {
      createPermit({
        variables: {
          input: {
            ...formState,
            codes: [HealthDirectoratePermitCodes.PatientSummary],
          },
        },
      })
        .then((response) => {
          console.log('createPermitResponse', response)
          if (response.data) {
            // Handle successful response
            setFormState(undefined)
            toast.success(formatMessage(messages.permitCreated))
            navigate(HealthPaths.HealthPatientDataPermits)
          }
        })
        .catch((error) => {
          toast.error(formatMessage(messages.permitCreatedError))
        })
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermitTitle)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
    >
      {step === 1 && (
        <FirstStep
          onClick={() => setStep(2)}
          formState={formState}
          setFormState={setFormState}
        />
      )}
      {step === 2 && (
        <SecondStep
          onClick={() => setStep(3)}
          goBack={() => setStep(1)}
          setFormState={setFormState}
          formState={formState}
        />
      )}
      {step === 3 && (
        <ThirdStep goBack={() => setStep(2)} onClick={handleSubmit} />
      )}
      {step === undefined && (
        <Problem title={formatMessage(messages.errorTryAgain)} />
      )}
    </IntroWrapper>
  )
}

export default NewPermit
