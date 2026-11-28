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
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { ConfirmModal } from '../../components/PatientDataPermit/ConfirmModal'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { DelegationState } from '../../utils/types'
import SecondStep from './components/ChooseDate'
import FirstStep from './components/ChoosePerson'
import {
  useCheckMedicineDelegationStepUpMutation,
  useGetMedicineDelegationsLazyQuery,
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

const REFETCH_ON_SAVE = ['GetMedicineDelegations']

const sameDay = (a: string | Date | null | undefined, b: Date) =>
  a != null && new Date(a).toDateString() === b.toDateString()

const problemStatus = (error: unknown) =>
  findProblemInApolloError(error as ApolloError)?.status

const NewMedicineDelegation = () => {
  const { formatMessage, lang } = useLocale()
  useHealthPlausibleSwap()
  const [step, setStep] = useState<number>(1)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [formState, setFormState] = useState<DelegationState>()
  const navigate = useNavigate()

  // The list is only fetched again once a delegation was saved, not while waiting for the step-up.
  const [postMedicineDelegation, { loading }] =
    usePostMedicineDelegationMutation({
      refetchQueries: ({ data }) =>
        data?.healthDirectorateMedicineDelegationCreate.success
          ? REFETCH_ON_SAVE
          : [],
      awaitRefetchQueries: true,
    })

  const [checkStepUp] = useCheckMedicineDelegationStepUpMutation({
    refetchQueries: ({ data }) =>
      data?.healthDirectorateMedicineDelegationCheckStepUp.success
        ? REFETCH_ON_SAVE
        : [],
    awaitRefetchQueries: true,
  })
  const [getDelegations] = useGetMedicineDelegationsLazyQuery({
    fetchPolicy: 'network-only',
  })
  const [stepUp, setStepUp] = useState<PendingStepUp>()
  const created = useRef(false)

  /** The answer to a check can be lost after the save, and the next one then says expired. */
  const wasSaved = async (input: DelegationInput) => {
    const { data } = await getDelegations({
      variables: { locale: lang, input: { status: ['active'] } },
    })
    return (
      data?.healthDirectorateMedicineDelegations?.items?.some(
        (item) =>
          item.isActive &&
          item.nationalId === input.nationalId &&
          sameDay(item.dates?.to, input.to),
      ) ?? false
    )
  }

  // Once only: a check can confirm after the step-up screen was closed.
  const handleCreated = () => {
    if (created.current) {
      return
    }
    created.current = true
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
    // A second click would start a second step-up and a second prompt on the phone.
    if (loading) {
      return
    }
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
        .catch((error: unknown) => {
          toast.error(
            problemStatus(error) === 403
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
    } catch (error) {
      // A 4xx is final and shown as such; anything else is retried on the next poll.
      const status = problemStatus(error)
      if (status && status >= 400 && status < 500) {
        throw 'refused'
      }
      throw error
    }

    if (result?.status === 'confirmed') {
      if (result.success) {
        // Here and not only in onConfirmed, which is skipped if the screen was closed meanwhile.
        handleCreated()
      } else {
        // Authenticated, but the delegation could not be saved.
        handleClose()
        toast.error(formatMessage(messages.permitCreatedError, { arg: '' }))
        return 'pending'
      }
    }

    if (result?.status === 'expired' && (await wasSaved(stepUp.input))) {
      handleCreated()
      return 'confirmed'
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
            context={`${formatMessage(messages.medicineDelegation)}: ${
              formState?.name ?? ''
            }`}
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
