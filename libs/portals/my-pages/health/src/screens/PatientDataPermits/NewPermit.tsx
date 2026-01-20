import { ActionCard, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfirmModal } from '../../components/PatientDataPermit/ConfirmModal'
import Countries from '../../components/PatientDataPermit/Countries'
import Dates from '../../components/PatientDataPermit/Dates'
import Terms from '../../components/PatientDataPermit/Terms'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { PermitInput } from '../../utils/types'
import { useCreatePatientDataPermitMutation } from './PatientDataPermits.generated'

const DEFAULT_STEP = 1 // Default to step 1 to start with the first step

const NewPermit: React.FC = () => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<number>(DEFAULT_STEP)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [formState, setFormState] = useState<PermitInput>()

  const navigate = useNavigate()

  const [createPermit, { loading }] = useCreatePatientDataPermitMutation({
    refetchQueries: ['GetPatientDataPermits'],
    awaitRefetchQueries: true,
  })

  const handleSubmit = () => {
    if (formState) {
      if (
        formState.countries.length > 0 &&
        formState.dates.validFrom &&
        formState.dates.validTo
      ) {
        setOpenModal(false)
        createPermit({
          variables: {
            input: {
              validFrom: formState.dates.validFrom?.toISOString(),
              validTo: formState.dates.validTo?.toISOString(),
              countryCodes: formState.countries.map((c) => c.code),
              codes: [''],
            },
          },
        })
          .then((response) => {
            if (
              response.data?.healthDirectoratePatientDataCreatePermit?.status
            ) {
              setFormState(undefined)
              toast.success(formatMessage(messages.permitCreated))
              navigate(HealthPaths.HealthPatientDataPermits, {
                replace: true,
              })
            } else
              toast.error(
                formatMessage(messages.permitCreatedError, {
                  arg: '',
                }),
              )
          })
          .catch(() => {
            toast.error(formatMessage(messages.permitCreatedError, { arg: '' }))
          })
      }
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermitTitle)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirPatientPermitsTooltip,
      )}
    >
      {step === 1 && (
        <Countries
          onClick={() => setStep(2)}
          formState={formState}
          setFormState={setFormState}
        />
      )}
      {step === 2 && (
        <Dates
          onClick={() => setStep(3)}
          goBack={() => setStep(1)}
          setFormState={setFormState}
          formState={formState}
        />
      )}
      {step === 3 && (
        <Terms
          goBack={() => setStep(2)}
          loading={loading}
          onClick={() => setOpenModal(true)}
        />
      )}

      {openModal && (
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
                fromDate: formState?.dates.validFrom?.toLocaleDateString(),
                toDate: formState?.dates.validTo?.toLocaleDateString(),
              })}
              heading={formatMessage(messages.permit)}
              text={formState?.countries
                .map((country) => country.name)
                .join(', ')}
            />
          }
        />
      )}
    </IntroWrapper>
  )
}

export default NewPermit
