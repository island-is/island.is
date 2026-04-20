import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { useLocale } from '@island.is/localization'
import { AlertMessage, Box, Select, Text } from '@island.is/island-ui/core'

import { FormScreen } from '../components/form/FormScreen'
import { useInvolvedParties } from '../hooks/useInvolvedParties'
import { useApplication } from '../hooks/useUpdateApplication'
import { error, requirements } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'

type AdditionalParty = {
  id: string
  title: string
  slug: string
  nationalId: string
}

type InvolvedParty = Omit<AdditionalParty, 'nationalId'> & {
  nationalId?: string | null
}

const isMinistry = (title: string) => title.toLowerCase().includes('ráðuneyti')

const isSelectableAdditionalParty = (
  party: InvolvedParty,
  currentInvolvedPartyId?: string,
): party is AdditionalParty =>
  party.id !== currentInvolvedPartyId &&
  isMinistry(party.title) &&
  typeof party.nationalId === 'string' &&
  party.nationalId.length > 0

const toAdditionalPartyOption = (party: AdditionalParty) => ({
  label: party.title,
  value: {
    id: party.id,
    title: party.title,
    slug: party.slug,
    nationalId: party.nationalId,
  },
})

export const AdditionalPartiesScreen = ({
  application,
  setSubmitButtonDisabled,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { control } = useFormContext()
  const { updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  const {
    involvedParties,
    error: involvedPartiesError,
    loading,
  } = useInvolvedParties({
    applicationId: application.id,
  })

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(false)
  }, [setSubmitButtonDisabled])

  const watchedInvolvedPartyId = useWatch({
    control,
    name: InputFields.advert.involvedPartyId,
  }) as string | undefined

  const currentInvolvedPartyId =
    watchedInvolvedPartyId ?? application.answers.advert?.involvedPartyId

  const watchedAdditionalParties = useWatch({
    control,
    name: InputFields.requirements.additionalParties,
  }) as AdditionalParty[] | undefined

  const currentAdditionalParties = useMemo(
    () =>
      watchedAdditionalParties ?? application.answers.additionalParties ?? [],
    [application.answers.additionalParties, watchedAdditionalParties],
  )

  const additionalPartyOptions = useMemo(() => {
    if (!involvedParties) {
      return []
    }

    return involvedParties
      .filter((party) =>
        isSelectableAdditionalParty(party, currentInvolvedPartyId),
      )
      .map(toAdditionalPartyOption)
  }, [currentInvolvedPartyId, involvedParties])

  const selectedAdditionalPartyOptions = useMemo(
    () =>
      currentAdditionalParties
        .filter((party) =>
          isSelectableAdditionalParty(party, currentInvolvedPartyId),
        )
        .map(toAdditionalPartyOption),
    [currentAdditionalParties, currentInvolvedPartyId],
  )

  return (
    <FormScreen
      title={f(requirements.additionalParties.label)}
      intro={f(requirements.additionalParties.intro)}
      loading={loading}
    >
      {involvedPartiesError ? (
        <AlertMessage
          type="error"
          title={f(error.fetchApplicationFailedTitle)}
          message={f(error.fetchApplicationFailedMessage)}
        />
      ) : additionalPartyOptions.length > 0 ? (
        <Select<AdditionalParty, true>
          size="sm"
          name={InputFields.requirements.additionalParties}
          label={f(requirements.additionalParties.label)}
          placeholder={f(requirements.additionalParties.placeholder)}
          backgroundColor="blue"
          isMulti
          isClearable
          options={additionalPartyOptions}
          value={selectedAdditionalPartyOptions}
          onChange={(selectedOptions) => {
            const parties = selectedOptions.map((option) => option.value)
            updateApplicationV2({
              path: InputFields.requirements.additionalParties,
              value: parties,
            })
          }}
        />
      ) : (
        <Box>
          <Text>{f(requirements.additionalParties.empty)}</Text>
        </Box>
      )}
    </FormScreen>
  )
}
