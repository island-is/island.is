import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider, Controller, Control } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  LinkResolver,
  m as coreMessages,
} from '@island.is/service-portal/core'
import {
  Box,
  Button,
  GridColumn,
  RadioButton,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'

import { Problem } from '@island.is/react-spa/shared'
import { HealthPaths } from '../../lib/paths'
import { messages as m } from '../../lib/messages'
import * as styles from './OrganDonationRegistration.css'
import { getOptions } from '../../utils/OrganDonationMock'

interface FormData {
  selectedChoice?: string
  selectedLimitations?: string[] // is array because it can have multiple values in the future
}

const OrganDonationRegistration = () => {
  useNamespaces('sp.health')

  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = getOptions(lang)
  const navigate = useNavigate()

  const [formState, setFormState] = useState<FormData>()

  const hookFormData = useForm<FormData>()

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = hookFormData

  const clearAll = () => {
    // Clear form, state and errors on success.
    setFormState(undefined)
    reset()
  }

  const handleSubmitForm = (submitData: FormData) => {
    const formData = new FormData()
    // TODO: Skipta út fyrir þjónustu
    console.log(submitData)
    if (submitData.selectedChoice) {
      formData.append('selectedChoice.id', submitData.selectedChoice)
      if (submitData.selectedLimitations) {
        formData.append(
          'selectedLimitations',
          submitData.selectedLimitations.toString(),
        )
      }
      clearAll()

      toast.success('Skráning tókst')
      navigate(HealthPaths.HealthOrganDonation, { replace: true })
    } else {
      toast.error(
        'Ekki tókst að skrá breytingu, athugið að velja einn valmöguleika.',
      )
    }
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.organDonation)}
        intro={formatMessage(m.organDonationDescription)}
      />
      <Box>
        <FormProvider {...hookFormData}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <fieldset style={{ border: 'none' }}>
              <legend>
                <Text variant="eyebrow" color="purple400" marginBottom={1}>
                  {formatMessage(m.changeRegistration)}
                </Text>
              </legend>
              {!loading && !error && (
                <>
                  <Box>
                    <Stack space={2}>
                      <Controller
                        name="selectedChoice"
                        control={control as Control<any, string>}
                        render={({ field: { value, onChange } }) => (
                          <Stack space={2}>
                            {data.data.options.map((x, xi) => {
                              return (
                                <Box
                                  background="blue100"
                                  borderRadius="large"
                                  border="standard"
                                  borderColor="blue200"
                                  padding={3}
                                  key={`organ-donation-${xi}`}
                                >
                                  <RadioButton
                                    id={x.id}
                                    name="organ-donation-form"
                                    label={x.title}
                                    key={`organ-donation-${x.id}`}
                                    value={x.id}
                                    checked={value === x.id}
                                    onChange={({ target }) => {
                                      onChange(target.value)
                                      setFormState((currentState) => ({
                                        ...currentState,
                                        selectedChoice: target.value,
                                      }))
                                    }}
                                  />
                                  {value === x.id && x.limitations && (
                                    <Box marginTop={2}>
                                      <Stack space={2}>
                                        <Box
                                          display="flex"
                                          flexDirection="row"
                                          flexWrap="wrap"
                                          width="full"
                                        >
                                          {x.limitations.map((y, yi) => {
                                            return (
                                              <GridColumn
                                                span="5/7"
                                                key={`organ-donation-limitation-${yi}`}
                                              >
                                                <Box marginY="smallGutter">
                                                  <InputController
                                                    id="organ-donation-limitation"
                                                    name="selectedLimitations"
                                                    textarea
                                                    label={formatMessage(
                                                      m.organRegistrationOtherLabel,
                                                    )}
                                                    placeholder={formatMessage(
                                                      m.organRegistrationOtherText,
                                                    )}
                                                    maxLength={220}
                                                    rules={{
                                                      minLength: {
                                                        value: 1,
                                                        message: formatMessage(
                                                          m.organLimitationsError,
                                                        ),
                                                      },
                                                    }}
                                                    onChange={(e) => {
                                                      setFormState(
                                                        (currentState) =>
                                                          ({
                                                            ...currentState,
                                                            selectedLimitations:
                                                              [e.target.value], // Initialize the array with the new value if it doesn't exist
                                                          } as FormData),
                                                      )
                                                    }}
                                                  />
                                                </Box>
                                              </GridColumn>
                                            )
                                          })}
                                        </Box>
                                      </Stack>
                                    </Box>
                                  )}
                                </Box>
                              )
                            })}
                          </Stack>
                        )}
                      />
                    </Stack>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flexEnd"
                    marginTop={3}
                    className={styles.buttonContainer}
                  >
                    <LinkResolver href={HealthPaths.HealthOrganDonation}>
                      <Button size="small" variant="ghost">
                        {formatMessage(coreMessages.buttonCancel)}
                      </Button>
                    </LinkResolver>
                    <Button
                      size="small"
                      type="submit"
                      loading={loading || isSubmitting}
                      disabled={
                        !formState?.selectedChoice ||
                        (formState?.selectedChoice === '2' &&
                          formState?.selectedLimitations === undefined) ||
                        (formState?.selectedChoice === '2' &&
                          formState?.selectedLimitations &&
                          formState?.selectedLimitations[0] === '') ||
                        isSubmitting
                      }
                    >
                      {formatMessage(coreMessages.codeConfirmation)}
                    </Button>
                  </Box>
                </>
              )}
            </fieldset>
            {error && !loading && (
              <Problem error={undefined} noBorder={false} />
            )}
            {!error && !loading && data.data.options.length === 0 && (
              <Problem type="no_data" noBorder={false} />
            )}
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default OrganDonationRegistration
