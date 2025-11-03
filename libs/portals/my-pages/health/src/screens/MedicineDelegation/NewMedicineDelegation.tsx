import { Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DelegationState } from '../../utils/types'
import SecondStep from './components/ChooseDate'
import FirstStep from './components/ChoosePerson'
import { usePostMedicineDelegationMutation } from './MedicineDelegation.generated'

const NewMedicineDelegation = () => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<number>(1)
  const [formState, setFormState] = useState<DelegationState>()
  const navigate = useNavigate()

  const [postMedicineDelegation, { loading }] =
    usePostMedicineDelegationMutation()

  const submit = () => {
    if (formState?.nationalId && formState?.dateFrom && formState?.dateTo) {
      postMedicineDelegation({
        variables: {
          input: {
            nationalId: formState.nationalId,
            from: formState.dateFrom,
            to: formState.dateTo,
            lookup: formState.lookup || false,
          },
        },
      })
        .then((response) => {
          if (
            response.data?.healthDirectorateMedicineDelegationCreate.success
          ) {
            toast.success(formatMessage(messages.permitCreated))
            navigate(HealthPaths.HealthMedicineDelegation)
          } else {
            toast.error(formatMessage(messages.permitCreatedError))
          }
        })
        .catch(() => {
          toast.error(formatMessage(messages.permitCreatedError))
        })
    }
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
        <FirstStep setFormState={setFormState} formState={formState} />
      )}
      {step === 2 && (
        <SecondStep setFormState={setFormState} formState={formState} />
      )}
      <Box
        display="flex"
        justifyContent={'spaceBetween'}
        marginTop={4}
        flexWrap="wrap"
        columnGap={[0, 0, 0, 2]}
      >
        <Box marginRight={1}>
          <Button
            fluid
            variant="ghost"
            size="small"
            type="button"
            onClick={() => navigate(-1)}
            preTextIcon="arrowBack"
          >
            {formatMessage(m.buttonCancel)}
          </Button>
        </Box>
        <Box marginLeft={1}>
          <Button
            fluid
            size="small"
            type="submit"
            loading={loading}
            disabled={
              step === 1
                ? !formState?.nationalId
                : !formState?.dateFrom || !formState?.dateTo
            }
            onClick={step === 1 ? () => setStep(2) : () => submit()}
          >
            {formatMessage(m.forward)}
          </Button>
        </Box>
      </Box>
    </IntroWrapper>
  )
}

export default NewMedicineDelegation
