import {
  Box,
  RadioButton,
  Stack,
  Text,
  Button,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  LinkResolver,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { messages } from '../..'
import { getOptions } from '../../utils/OrganDonationMock'
import { useState } from 'react'
import React from 'react'
import { HealthPaths } from '../../lib/paths'
import * as styles from './OrganDonationRegistration.css'
import Limitations from './Limitations'
import { useNavigate } from 'react-router-dom'

export const Form2 = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const { data, loading, error } = getOptions(lang)

  const [radioValue, setRadioValue] = useState<string | undefined>(undefined)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    // TODO: SEND DATA TO API
    toast.success(formatMessage(messages.registrationComplete))
    navigate(HealthPaths.HealthOrganDonation, { replace: true })

    // on error
    // toast.error(formatMessage(messages.registrationFailed))
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.organDonation)}
        intro={formatMessage(messages.organDonationDescription)}
      />
      <Text variant="eyebrow" color="purple400" marginBottom={1}>
        {formatMessage(messages.changeTake)}
      </Text>
      <form onSubmit={onSubmit}>
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
                  name="organ-registration-value"
                  label={x.title}
                  key={`organ-donation-${x.id}`}
                  value={x.id}
                  checked={radioValue === x.id} // TODO: Add default value as current user value
                  onChange={() => setRadioValue(x.id)}
                />
                {x.limitations && radioValue === x.id && (
                  <Limitations data={x.limitations} />
                )}
              </Box>
            )
          })}
        </Stack>
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
            disabled={radioValue === undefined}
          >
            {formatMessage(coreMessages.codeConfirmation)}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default Form2
