import { useLocale, useNamespaces } from '@island.is/localization'
import { OptionsOptions, getOptions } from '../../utils/OrganDonationMock'
import {
  IntroHeader,
  LinkResolver,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { messages as m } from '../../lib/messages'
import * as styles from './OrganDonationRegistration.css'
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

type SelectedChoice = Pick<OptionsOptions, 'id' | 'title'>

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

  let disabledSubmitButton = selectedChoice === null

  const [formError, setFormError] = useState(false)

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

  const submitRegistration = () => {
    // TODO: Skipta út fyrir þjónustu
    disabledSubmitButton = true
    if (selectedChoice !== null) {
      console.log(selectedChoice.title)
      selectedLimitations && console.log(selectedLimitations[0])
      toast.success('Skráning tókst')
      setSelectedChoice(null)
      setSelectedLimitations(null)
      navigate(HealthPaths.HealthOrganDonation, { replace: true })
    } else {
      toast.error('Ekki tókst að skrá breytingu, ath val')
    }
    disabledSubmitButton = false
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.organDonation)}
        intro={formatMessage(m.organDonationDescription)}
      />
      <Box>
        <Text variant="eyebrow" color="purple400" marginBottom={1}>
          {formatMessage(m.changeRegistration)}
        </Text>
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
                        name="organ-donation-form"
                        label={x.title}
                        key={`organ-donation-${x.id}`}
                        value={x.id}
                        checked={selectedChoice?.id === x.id}
                        onChange={() => {
                          setSelectedChoice({ id: x.id, title: x.title })
                        }}
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
                                    span={'5/7'}
                                    key={`organ-donation-limitation-${yi}`}
                                  >
                                    <Box marginY="smallGutter">
                                      <Input
                                        name="organ-donation-form"
                                        textarea
                                        label={formatMessage(
                                          m.organRegistrationOtherLabel,
                                        )}
                                        placeholder={formatMessage(
                                          m.organRegistrationOtherText,
                                        )}
                                        maxLength={220}
                                        value={
                                          selectedLimitations
                                            ? selectedLimitations[0]
                                            : ''
                                        }
                                        onChange={(e) =>
                                          setSelectedLimitations([
                                            e.target.value,
                                          ])
                                        }
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
                onClick={() => submitRegistration()}
                disabled={disabledSubmitButton}
              >
                {formatMessage(coreMessages.codeConfirmation)}
              </Button>
            </Box>
          </>
        )}
        {error && !loading && <Problem error={undefined} noBorder={false} />}
        {!error && !loading && data.data.options.length === 0 && (
          <Problem type="no_data" noBorder={false} />
        )}
      </Box>
    </Box>
  )
}

export default OrganDonationRegistration
