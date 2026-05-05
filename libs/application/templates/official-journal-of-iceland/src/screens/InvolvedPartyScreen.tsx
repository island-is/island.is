import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { involvedParty, requirements } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { ApplicationTypes } from '../lib/constants'
import { useInvolvedParties } from '../hooks/useInvolvedParties'
import { OJOISelectController } from '../components/input/OJOISelectController'
import {
  AlertMessage,
  Box,
  Checkbox,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'
import { DefaultEvents } from '@island.is/application/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { additionalPartySchema } from '../lib/dataSchema'
import { z } from 'zod'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import { Features } from '@island.is/feature-flags'

type AdditionalParty = z.infer<typeof additionalPartySchema>

const isSelectableAdditionalParty = (
  party: { id: string; title: string; nationalId?: string | null },
  currentInvolvedPartyId?: string,
): party is AdditionalParty =>
  party.id !== currentInvolvedPartyId &&
  party.title.toLowerCase().includes('ráðuneyti') &&
  typeof party.nationalId === 'string' &&
  party.nationalId.length > 0

export const InvolvedPartyScreen = ({
  application,
  setSubmitButtonDisabled,
  refetch,
}: OJOIFieldBaseProps) => {
  const { value: regulationsEnabled, loading: regulationsLoading } =
    useFeatureFlag(Features.officialJournalOfIcelandRegulations, false)

  const { updateApplication, updateApplicationV2, submitApplication } =
    useApplication({
      applicationId: application.id,
    })
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(true)
  }, [setSubmitButtonDisabled])

  const [isCurrentPartyMinistry, setIsCurrentPartyMinistry] = useState(() => {
    const title = getValueViaPath<string>(
      application.answers as Record<string, unknown>,
      InputFields.advert.involvedPartyTitle,
    )
    return !!title && title.toLowerCase().includes('ráðuneyti')
  })

  const [showAdditionalParties, setShowAdditionalParties] = useState(() => {
    const parties = application.answers.additionalParties
    return Array.isArray(parties) && parties.length > 0
  })

  const [selectedParties, setSelectedParties] = useState<AdditionalParty[]>(
    () => (application.answers.additionalParties as AdditionalParty[]) ?? [],
  )

  const { involvedParties, error, loading } = useInvolvedParties({
    applicationId: application.id,
    onError: () => {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    },
  })

  // Auto-action for the single-involved-party case. Driven from a useEffect
  // (rather than Apollo's onCompleted) so that we wait for the feature flag
  // to resolve before deciding which branch to take — otherwise a stale
  // `regulationsEnabled = false` closure could fire when the flag is
  // actually on. autoActionedRef prevents the effect from firing twice.
  const autoActionedRef = useRef(false)
  useEffect(() => {
    if (autoActionedRef.current) return
    if (loading || regulationsLoading) return
    if (!involvedParties || involvedParties.length !== 1) return

    autoActionedRef.current = true

    const involvedParty = involvedParties[0]

    // When the regulations feature is disabled, this screen has no
    // ministry-specific UI, so a single involved party should auto-submit
    // straight through — same as the original pre-regulation-flow flow.
    // applicationType is pinned to AD so downstream checks see an explicit
    // value, mirroring the `!isMinistry` branch below.
    if (!regulationsEnabled) {
      setValue(InputFields.advert.involvedPartyId, involvedParty.id)
      setValue('applicationType', ApplicationTypes.AD)

      const currentAnswers = structuredClone(application.answers)
      set(currentAnswers, InputFields.advert.involvedPartyId, involvedParty.id)
      set(currentAnswers, 'applicationType', ApplicationTypes.AD)

      updateApplication(currentAnswers, () => {
        submitApplication(DefaultEvents.SUBMIT, () => {
          refetch && refetch()
        })
      })
      return
    }

    const isMinistry = involvedParty.title.toLowerCase().includes('ráðuneyti')

    setIsCurrentPartyMinistry(isMinistry)

    setValue(InputFields.advert.involvedPartyId, involvedParty.id)
    setValue(InputFields.advert.involvedPartyTitle, involvedParty.title)

    const currentAnswers = structuredClone(application.answers)

    set(currentAnswers, InputFields.advert.involvedPartyId, involvedParty.id)
    set(
      currentAnswers,
      InputFields.advert.involvedPartyTitle,
      involvedParty.title,
    )

    // Pre-set applicationType for non-ministry parties so the
    // TypeSelection screen can be skipped entirely. additionalParties is
    // also cleared here — it's only meaningful for ministries, and a
    // ministry returning to this screen must keep its previously selected
    // parties intact.
    if (!isMinistry) {
      setValue(InputFields.requirements.additionalParties, [])
      setValue('applicationType', ApplicationTypes.AD)
      set(currentAnswers, InputFields.requirements.additionalParties, [])
      set(currentAnswers, 'applicationType', ApplicationTypes.AD)

      updateApplication(currentAnswers, () => {
        submitApplication(DefaultEvents.SUBMIT, () => {
          refetch && refetch()
        })
      })
      return
    }

    updateApplication(currentAnswers)
    setSubmitButtonDisabled && setSubmitButtonDisabled(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [involvedParties, regulationsEnabled, regulationsLoading, loading])

  const options = involvedParties?.map((involvedParty) => ({
    label: involvedParty.title,
    value: involvedParty.id,
  }))

  const defaultValue = options && options.length === 1 ? options[0].value : ''

  const disableSelect = options?.length === 1 || !!error

  const currentInvolvedPartyId = application.answers.advert?.involvedPartyId

  const additionalPartyOptions = useMemo(() => {
    if (!involvedParties) return []
    return involvedParties
      .filter((party) =>
        isSelectableAdditionalParty(party, currentInvolvedPartyId),
      )
      .map((party) => ({ label: party.title, value: party }))
  }, [currentInvolvedPartyId, involvedParties])

  const selectedPartyOptions = useMemo(
    () =>
      selectedParties
        .filter((party) =>
          isSelectableAdditionalParty(party, currentInvolvedPartyId),
        )
        .map((party) => ({ label: party.title, value: party })),
    [selectedParties, currentInvolvedPartyId],
  )

  const handleAdditionalPartiesToggle = (checked: boolean) => {
    setShowAdditionalParties(checked)
    if (!checked) {
      setSelectedParties([])
      updateApplicationV2({
        path: InputFields.requirements.additionalParties,
        value: [],
      })
    }
  }

  return (
    <FormScreen
      title={f(involvedParty.general.title)}
      intro={f(involvedParty.general.intro)}
      loading={loading}
    >
      <Box>
        <Box marginBottom={2}>
          <Stack space={2}>
            {involvedParties?.length === 0 && (
              <AlertMessage
                type="warning"
                title={f(involvedParty.errors.noDataTitle)}
                message={f(involvedParty.errors.noDataMessage)}
              />
            )}
            {!!error && (
              <AlertMessage
                type="error"
                title={f(involvedParty.errors.title)}
                message={
                  error.graphQLErrors?.[0].message === 'Forbidden'
                    ? f(involvedParty.errors.messageForbidden)
                    : f(involvedParty.errors.message)
                }
              />
            )}
          </Stack>
        </Box>
        <OJOISelectController
          width="half"
          disabled={disableSelect}
          loading={loading}
          name={InputFields.advert.involvedPartyId}
          label={f(involvedParty.general.section)}
          options={options}
          applicationId={application.id}
          defaultValue={defaultValue}
          placeholder={involvedParty.inputs.select.placeholder}
          onChange={(selectedId) => {
            // When the regulations feature is disabled, the OJOISelectController
            // already persists involvedPartyId — there is no ministry-specific
            // bookkeeping to do, so just enable the submit button.
            if (!regulationsEnabled) {
              setSubmitButtonDisabled && setSubmitButtonDisabled(false)
              return
            }

            // Also persist the party title so downstream screens
            // can check whether the party is a ministry.
            const party = involvedParties?.find((p) => p.id === selectedId)
            if (party) {
              const answers = structuredClone(application.answers)
              const partyIsMinistry = party.title
                .toLowerCase()
                .includes('ráðuneyti')
              const additionalParties = (
                application.answers.additionalParties ?? []
              ).filter((additionalParty) => additionalParty.id !== party.id)

              set(answers, InputFields.advert.involvedPartyId, party.id)
              set(answers, InputFields.advert.involvedPartyTitle, party.title)
              set(
                answers,
                InputFields.requirements.additionalParties,
                additionalParties,
              )

              if (!partyIsMinistry) {
                setValue('applicationType', ApplicationTypes.AD)
                set(answers, 'applicationType', ApplicationTypes.AD)
              }

              setValue(InputFields.advert.involvedPartyId, party.id)
              setValue(InputFields.advert.involvedPartyTitle, party.title)
              setValue(
                InputFields.requirements.additionalParties,
                additionalParties,
              )
              updateApplication(answers)

              setIsCurrentPartyMinistry(partyIsMinistry)
              setSelectedParties(additionalParties as AdditionalParty[])
              if (!partyIsMinistry) {
                setShowAdditionalParties(false)
              }
            }
            setSubmitButtonDisabled && setSubmitButtonDisabled(false)
          }}
        />
        {isCurrentPartyMinistry && regulationsEnabled && (
          <Box marginTop={3}>
            <Checkbox
              id="showAdditionalParties"
              name="showAdditionalParties"
              label={f(requirements.additionalParties.checkbox)}
              checked={showAdditionalParties}
              onChange={(e) => handleAdditionalPartiesToggle(e.target.checked)}
              backgroundColor="blue"
              large
            />
          </Box>
        )}
        {isCurrentPartyMinistry && regulationsEnabled && showAdditionalParties && (
          <Box marginTop={3}>
            {additionalPartyOptions.length > 0 ? (
              <Select<AdditionalParty, true>
                size="sm"
                name={InputFields.requirements.additionalParties}
                label={f(requirements.additionalParties.label)}
                placeholder={f(requirements.additionalParties.placeholder)}
                backgroundColor="blue"
                isMulti
                isClearable
                options={additionalPartyOptions}
                value={selectedPartyOptions}
                onChange={(selectedOptions) => {
                  const parties = selectedOptions.map((option) => option.value)
                  setSelectedParties(parties)
                  updateApplicationV2({
                    path: InputFields.requirements.additionalParties,
                    value: parties,
                  })
                }}
              />
            ) : (
              <Text>{f(requirements.additionalParties.empty)}</Text>
            )}
          </Box>
        )}
      </Box>
    </FormScreen>
  )
}
