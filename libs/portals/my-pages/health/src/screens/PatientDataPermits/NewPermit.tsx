import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Countries from '../../components/PatientDataPermit/Countries'
import Dates from '../../components/PatientDataPermit/Dates'
import Terms from '../../components/PatientDataPermit/Terms'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { PermitInput } from '../../utils/types'
import { useCreatePatientDataPermitMutation } from './PatientDataPermits.generated'
import { Markdown } from '@island.is/shared/components'

const DEFAULT_STEP = 1 // Default to step 1 to start with the first step

type EditRouteState = {
  countries?: { code: string; name: string }[]
  validFrom?: string | null
  validTo?: string | null
}

const isValidDate = (date: Date | null) =>
  date !== null && !Number.isNaN(date.getTime())

const isEditRouteState = (state: unknown): state is EditRouteState =>
  typeof state === 'object' &&
  state !== null &&
  (!('countries' in state) ||
    (Array.isArray((state as EditRouteState).countries) &&
      ((state as EditRouteState).countries ?? []).every(
        (c) => typeof c.code === 'string' && typeof c.name === 'string',
      )))

const buildInitialFormState = (state: unknown): PermitInput | undefined => {
  if (!isEditRouteState(state) || !state.countries?.length) return undefined

  const validFromDate = state.validFrom ? new Date(state.validFrom) : null
  const validToDate = state.validTo ? new Date(state.validTo) : null

  return {
    countries: state.countries,
    dates: {
      validFrom: isValidDate(validFromDate) ? validFromDate : null,
      validTo: isValidDate(validToDate) ? validToDate : null,
    },
  }
}

const NewPermit: React.FC = () => {
  const { formatMessage } = useLocale()
  const location = useLocation()
  const [step, setStep] = useState<number>(DEFAULT_STEP)
  const [formState, setFormState] = useState<PermitInput | undefined>(() =>
    buildInitialFormState(location.state),
  )

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
        createPermit({
          variables: {
            input: {
              validFrom: formState.dates.validFrom?.toISOString(),
              validTo: formState.dates.validTo?.toISOString(),
              countryCodes: formState.countries.map((c) => c.code),
              // Currently only patient-summary consent type is available.
              // When more become availablein the near future, consent types will be added and sent here.
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
              navigate(HealthPaths.HealthPatientDataPermitsDetail, {
                replace: true,
              })
            } else {
              toast.error(
                formatMessage(messages.permitCreatedError, { arg: '' }),
              )
            }
          })
          .catch(() => {
            toast.error(formatMessage(messages.permitCreatedError, { arg: '' }))
          })
      }
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.addPermit)}
      introComponent={
        <Markdown>{formatMessage(messages.permitDetailIntroWithLink)}</Markdown>
      }
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
          onClick={handleSubmit}
        />
      )}
    </IntroWrapper>
  )
}

export default NewPermit
