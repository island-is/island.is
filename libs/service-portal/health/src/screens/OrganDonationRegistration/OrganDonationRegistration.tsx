import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
  Input,
  RadioButton,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { HealthPaths } from '../../lib/paths'
import { messages as m } from '../../lib/messages'
import * as styles from './OrganDonationRegistration.css'
import { OptionsOptions, getOptions } from '../../utils/OrganDonationMock'

type SelectedChoice = Pick<OptionsOptions, 'id' | 'title'>

interface FormData {
  selectedChoice: SelectedChoice | null
  selectedLimitations: string[] | null
}

const OrganDonationRegistration = () => {
  useNamespaces('sp.health')

  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = getOptions(lang)
  const navigate = useNavigate()

  const [selectedChoice, setSelectedChoice] = useState<SelectedChoice | null>(
    null,
  )
  const [selectedLimitations, setSelectedLimitations] = useState<
    string[] | null
  >(null)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ mode: 'onChange' })

  const clearAll = () => {
    // Clear form, state and errors on success.
    setSelectedChoice(null)
    setSelectedLimitations(null)
    reset()
    // refetch()
  }

  const limitationChanges = (currentValue: string) => {
    const arr = selectedLimitations ?? []
    if (selectedLimitations?.includes(currentValue)) {
      const index = arr.indexOf(currentValue)
      if (index > -1) arr.splice(index, 1)
    } else {
      arr?.push(currentValue)
    }
    setSelectedLimitations(arr)
  }

  const handleSubmitForm = (data: FormData) => {
    const formData = new FormData()
    // const data = Object.fromEntries(formData.entries())
    // TODO: Skipta út fyrir þjónustu
    if (selectedChoice !== null) {
      formData.append('selectedChoice.id', selectedChoice.id)
      formData.append('selectedChoice.title', selectedChoice.title)
      if (selectedLimitations !== null) {
        formData.append('selectedLimitations', selectedLimitations.toString())
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
                            name="organ-donation"
                            label={x.title}
                            key={`organ-donation-${x.id}`}
                            value={x.id}
                            checked={selectedChoice?.id === x.id}
                            onChange={(e) =>
                              setSelectedChoice({
                                id: e.target.value,
                                title: x.title,
                              })
                            }
                          />
                          {selectedChoice?.id === x.id && x.limitations && (
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
                                          <Input
                                            id={y}
                                            textarea
                                            label={formatMessage(
                                              m.organRegistrationOtherLabel,
                                            )}
                                            placeholder={formatMessage(
                                              m.organRegistrationOtherText,
                                            )}
                                            maxLength={220}
                                            required
                                            value={
                                              selectedLimitations
                                                ? selectedLimitations[yi]
                                                : ''
                                            }
                                            name="organ-donation"
                                            onChange={(e) => {
                                              setSelectedLimitations([
                                                e.target.value,
                                              ])
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
                    loading={loading}
                    disabled={selectedChoice === null || isSubmitting}
                  >
                    {formatMessage(coreMessages.codeConfirmation)}
                  </Button>
                </Box>
              </>
            )}
          </fieldset>
          {error && !loading && <Problem error={undefined} noBorder={false} />}
          {!error && !loading && data.data.options.length === 0 && (
            <Problem type="no_data" noBorder={false} />
          )}
        </form>
      </Box>
    </Box>
  )
}

export default OrganDonationRegistration
