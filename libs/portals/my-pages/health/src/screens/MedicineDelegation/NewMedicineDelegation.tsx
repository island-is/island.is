import type { ApolloError } from '@apollo/client'
import { ActionCard, Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m as coreMessages,
  StepUpAuthentication,
  type StepUpStart,
  type StepUpStatus,
} from '@island.is/portals/core'
import {
  STAFRAEN_HEILSA_SLUG,
  IntroWrapper,
  m,
  Modal,
} from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmModal } from '../../components/PatientDataPermit/ConfirmModal'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DelegationState } from '../../utils/types'
import SecondStep from './components/ChooseDate'
import FirstStep from './components/ChoosePerson'
import {
  useCheckMedicineDelegationStepUpMutation,
  usePostMedicineDelegationMutation,
} from './MedicineDelegation.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

type DelegationInput = {
  nationalId: string
  from: Date
  to: Date
  lookup: boolean
}

/** Waiting for electronic ID: nothing is saved until the check confirms it. */
type PendingStepUp = {
  authReqId: string
  start: StepUpStart
  input: DelegationInput
}

const isForbidden = (error: ApolloError) =>
  error.graphQLErrors?.some(
    ({ extensions }) => extensions?.code === 'FORBIDDEN',
  )

const NewMedicineDelegation = () => {
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()
  const [step, setStep] = useState<number>(1)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [formState, setFormState] = useState<DelegationState>()
  const navigate = useNavigate()

  const [postMedicineDelegation, { loading }] =
    usePostMedicineDelegationMutation({
      refetchQueries: ['GetMedicineDelegations'],
      awaitRefetchQueries: true,
    })

  const [checkStepUp] = useCheckMedicineDelegationStepUpMutation({
    refetchQueries: ['GetMedicineDelegations'],
    awaitRefetchQueries: true,
  })
  const [stepUp, setStepUp] = useState<PendingStepUp>()

  const handleCreated = () => {
    toast.success(formatMessage(messages.permitCreated))
    navigate(HealthPaths.HealthMedicineDelegation, {
      replace: true,
    })
  }

  const handleClose = () => {
    setStepUp(undefined)
    setOpenModal(false)
  }

  const handleSubmit = () => {
    if (formState?.nationalId && formState?.dateFrom && formState?.dateTo) {
      const input: DelegationInput = {
        nationalId: formState.nationalId,
        from: formState.dateFrom,
        to: formState.dateTo,
        lookup: formState.lookup || false,
      }

      postMedicineDelegation({ variables: { input } })
        .then((response) => {
          const result =
            response.data?.healthDirectorateMedicineDelegationCreate

          if (result?.stepUp) {
            const { authReqId, ...start } = result.stepUp
            setStepUp({ authReqId, start, input })
          } else if (result?.success) {
            handleCreated()
          } else {
            toast.error(
              formatMessage(messages.permitCreatedError, {
                arg: result?.message || '',
              }),
            )
          }
        })
        .catch((error: ApolloError) => {
          toast.error(
            isForbidden(error)
              ? formatMessage(coreMessages.stepUpUnavailable)
              : formatMessage(messages.permitCreatedError, { arg: '' }),
          )
        })
    }
  }

  const handleCheck = async (): Promise<StepUpStatus> => {
    if (!stepUp) {
      return 'pending'
    }

    let result
    try {
      const response = await checkStepUp({
        variables: {
          input: { authReqId: stepUp.authReqId, delegation: stepUp.input },
        },
      })
      result = response.data?.healthDirectorateMedicineDelegationCheckStepUp
    } catch {
      // The step-up screen shows this as an authentication that could not be confirmed.
      throw 'refused'
    }

    if (result?.status === 'confirmed' && !result.success) {
      // Authenticated, but the delegation could not be saved.
      handleClose()
      toast.error(formatMessage(messages.permitCreatedError, { arg: '' }))
      return 'pending'
    }

    return result?.status ?? 'pending'
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.medicineDelegation)}
      intro={formatMessage(messages.newMedicineDelegationIntroText)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(
          messages.stafraenHeilsaMedicineDelegationTooltip,
        ),
      }}
      desktopContentSpan="10/12"
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
              (step === 1
                ? formState?.nationalId?.length !== 10 ||
                  formState?.name === undefined
                : !formState?.dateFrom || !formState?.dateTo) || loading
            }
            onClick={step === 1 ? () => setStep(2) : () => setOpenModal(true)}
          >
            {formatMessage(m.forward)}
          </Button>
        </Box>
      </Box>
      {openModal && stepUp && (
        <Modal
          id="medicine-delegation-step-up-modal"
          initialVisibility
          isVisible
          onCloseModal={handleClose}
        >
          <StepUpAuthentication
            key={stepUp.authReqId}
            stepUp={stepUp.start}
            check={handleCheck}
            onConfirmed={handleCreated}
            onRetry={handleSubmit}
            retrying={loading}
            context={formState?.name}
            onBack={handleClose}
          />
        </Modal>
      )}
      {openModal && !stepUp && (
        <ConfirmModal
          title={formatMessage(messages.newPermit)}
          description={formatMessage(messages.addNewPermitTitle)}
          onSubmit={handleSubmit}
          open={openModal}
          onClose={() => setOpenModal(false)}
          loading={loading}
          content={
            <ActionCard
              date={formatMessage(messages.validToFrom, {
                fromDate: formState?.dateFrom?.toLocaleDateString(),
                toDate: formState?.dateTo?.toLocaleDateString(),
              })}
              heading={formState?.name}
              headingVariant="h4"
              text={
                formState?.lookup
                  ? formatMessage(messages.pickupMedicineAndLookup)
                  : formatMessage(messages.pickupMedicine)
              }
            />
          }
        />
      )}
    </IntroWrapper>
  )
}

export default NewMedicineDelegation
