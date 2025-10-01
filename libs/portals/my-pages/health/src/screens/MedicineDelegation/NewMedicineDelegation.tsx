import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import SecondStep from './components/ChooseDate'
import FirstStep from './components/ChoosePerson'
import { DelegationInput } from './utils/mockdata'

const NewMedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<number>(1)
  const [formState, setFormState] = useState<DelegationInput>()
  const navigate = useNavigate()

  const submit = () => {
    // Submit to api
    toast.success(formatMessage(messages.permitCreated))
    navigate(HealthPaths.HealthMedicineDelegation)
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.medicineDelegationIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
    >
      {step === 1 && (
        <FirstStep
          onClick={() => setStep(2)}
          setFormState={setFormState}
          formState={formState}
        />
      )}
      {step === 2 && (
        <SecondStep
          onClick={() => submit()}
          setFormState={setFormState}
          formState={formState}
        />
      )}
    </IntroWrapper>
  )
}

export default NewMedicineDelegation
