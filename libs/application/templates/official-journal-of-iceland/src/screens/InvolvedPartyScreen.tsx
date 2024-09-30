import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { involvedParty } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { useInvolvedParties } from '../hooks/useInvolvedParties'
import { OJOISelectController } from '../components/input/OJOISelectController'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'

export const InvolvedPartyScreen = ({
  application,
  setSubmitButtonDisabled,
}: OJOIFieldBaseProps) => {
  const { updateApplication } = useApplication({
    applicationId: application.id,
  })
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()

  const { involvedParties, error, loading } = useInvolvedParties({
    applicationId: application.id,
    onError: () => {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    },
    onComplete: (data) => {
      const involvedParties =
        data.officialJournalOfIcelandApplicationGetUserInvolvedParties
          .involvedParties

      if (involvedParties.length === 0 || involvedParties.length > 1) {
        setSubmitButtonDisabled && setSubmitButtonDisabled(true)
      }

      if (involvedParties.length === 1) {
        const involvedParty = involvedParties[0]

        setValue(InputFields.advert.involvedPartyId, involvedParty.id)

        const currentAnswers = structuredClone(application.answers)

        const updatedAnswers = set(
          currentAnswers,
          InputFields.advert.involvedPartyId,
          involvedParty.id,
        )

        updateApplication(updatedAnswers)
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
            message={f(involvedParty.errors.message)}
          />
        )}
      </Stack>
      <Box width="half">
        <OJOISelectController
          disabled={disableSelect}
          loading={loading}
          name={InputFields.advert.involvedPartyId}
          label={f(involvedParty.general.section)}
          options={options}
          applicationId={application.id}
          defaultValue={defaultValue}
          placeholder={involvedParty.inputs.select.placeholder}
          onChange={() =>
            setSubmitButtonDisabled && setSubmitButtonDisabled(false)
          }
        />
      </Box>
    </FormScreen>
  )
}
