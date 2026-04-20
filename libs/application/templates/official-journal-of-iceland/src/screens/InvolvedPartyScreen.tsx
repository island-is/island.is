import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { involvedParty } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { ApplicationTypes } from '../lib/constants'
import { useInvolvedParties } from '../hooks/useInvolvedParties'
import { OJOISelectController } from '../components/input/OJOISelectController'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'
import { DefaultEvents } from '@island.is/application/types'
import { useEffect } from 'react'

export const InvolvedPartyScreen = ({
  application,
  setSubmitButtonDisabled,
  refetch,
}: OJOIFieldBaseProps) => {
  const { updateApplication, submitApplication } = useApplication({
    applicationId: application.id,
  })
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(true)
  }, [setSubmitButtonDisabled])

  const { involvedParties, error, loading } = useInvolvedParties({
    applicationId: application.id,
    onError: () => {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    },
    onComplete: (data) => {
      const involvedParties =
        data.officialJournalOfIcelandApplicationGetUserInvolvedParties
          .involvedParties

      if (involvedParties.length === 1) {
        const involvedParty = involvedParties[0]
        const isMinistry = involvedParty.title
          .toLowerCase()
          .includes('ráðuneyti')

        setValue(InputFields.advert.involvedPartyId, involvedParty.id)
        setValue(InputFields.advert.involvedPartyTitle, involvedParty.title)
        setValue(InputFields.requirements.additionalParties, [])

        const currentAnswers = structuredClone(application.answers)

        set(
          currentAnswers,
          InputFields.advert.involvedPartyId,
          involvedParty.id,
        )
        set(
          currentAnswers,
          InputFields.advert.involvedPartyTitle,
          involvedParty.title,
        )
        set(currentAnswers, InputFields.requirements.additionalParties, [])

        // Pre-set applicationType for non-ministry parties so the
        // TypeSelection screen can be skipped entirely.
        if (!isMinistry) {
          setValue('applicationType', ApplicationTypes.AD)
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
      }
    },
  })

  const options = involvedParties?.map((involvedParty) => ({
    label: involvedParty.title,
    value: involvedParty.id,
  }))

  const defaultValue = options && options.length === 1 ? options[0].value : ''

  const disableSelect = options?.length === 1 || !!error

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
            // Also persist the party title so downstream screens
            // can check whether the party is a ministry.
            const party = involvedParties?.find((p) => p.id === selectedId)
            if (party) {
              const answers = structuredClone(application.answers)
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

              if (!party.title.toLowerCase().includes('ráðuneyti')) {
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
            }
            setSubmitButtonDisabled && setSubmitButtonDisabled(false)
          }}
        />
      </Box>
    </FormScreen>
  )
}
