import {
  Box,
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import React, { useCallback } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useReadableSeconds } from '../../../hooks/useReadableSeconds'
import { FormCard } from '../../../components/FormCard/FormCard'
import { useClient } from '../ClientContext'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'

interface CompareArgs {
  currVal: FormData
  orgVal: FormData
  key: string
}

/**
 * Compares the current form key value with the original form key value
 * @param currVal - Current form data
 * @param orgVal - Original form data
 * @param key - Form key to compare
 */
const compare = ({ currVal, orgVal, key }: CompareArgs) =>
  currVal.get(key) !== orgVal.get(key)

interface LifetimeProps {
  absoluteRefreshTokenLifetime: number
  refreshTokenExpiration: boolean
  slidingRefreshTokenLifetime: number
}

const Lifetime = ({
  absoluteRefreshTokenLifetime,
  slidingRefreshTokenLifetime,
  refreshTokenExpiration,
}: LifetimeProps) => {
  const { formatMessage } = useLocale()
  const [lifetime, setLifetime] = useEnvironmentState({
    absoluteRefreshTokenLifetime,
    refreshTokenExpiration,
    slidingRefreshTokenLifetime,
  })
  const { formatErrorMessage } = useErrorFormatMessage()
  const { actionData, client } = useClient()

  const setLifeTimeLength = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLifetime((prev) => ({
      ...prev,
      [event.target.name]: +event.target.value,
    }))
  }

  /**
   * Custom validation for the lifetime form
   */
  const customFormValidation = useCallback(
    (currVal: FormData, orgVal: FormData) => {
      if (compare({ currVal, orgVal, key: 'refreshTokenExpiration' }))
        return true

      if (currVal.get('refreshTokenExpiration')) {
        return (
          compare({ currVal, orgVal, key: 'absoluteRefreshTokenLifetime' }) ||
          compare({ currVal, orgVal, key: 'slidingRefreshTokenLifetime' })
        )
      }

      return compare({ currVal, orgVal, key: 'absoluteRefreshTokenLifetime' })
    },
    [],
  )

  const readableAbsoluteLifetime = useReadableSeconds(
    lifetime.absoluteRefreshTokenLifetime,
  )
  const readableInactivityLifetime = useReadableSeconds(
    lifetime.slidingRefreshTokenLifetime,
  )

  return (
    <FormCard
      title={formatMessage(m.lifetime)}
      description={formatMessage(m.lifeTimeDescription)}
      customValidation={customFormValidation}
      intent={ClientFormTypes.lifeTime}
      inSync={checkEnvironmentsSync(client.environments, [
        'absoluteRefreshTokenLifetime',
        'slidingRefreshTokenLifetime',
        'refreshTokenExpiration',
      ])}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            name="absoluteRefreshTokenLifetime"
            value={lifetime.absoluteRefreshTokenLifetime}
            backgroundColor="blue"
            onChange={setLifeTimeLength}
            label={formatMessage(m.absoluteLifetime)}
            errorMessage={formatErrorMessage(
              actionData?.errors
                ?.absoluteRefreshTokenLifetime as unknown as string,
            )}
          />
          <Text variant={'small'}>
            {formatMessage(m.absoluteLifetimeDescription)}
            <br />
            {readableAbsoluteLifetime}
          </Text>
        </Stack>
        <Stack space={1}>
          <ToggleSwitchCheckbox
            label={formatMessage(m.inactivityExpiration)}
            checked={lifetime.refreshTokenExpiration}
            name="refreshTokenExpiration"
            value={lifetime.refreshTokenExpiration.toString()}
            onChange={() =>
              setLifetime((prev) => ({
                ...prev,
                refreshTokenExpiration: !lifetime.refreshTokenExpiration,
              }))
            }
          />
          <Text variant={'small'}>
            {formatMessage(m.inactivityExpirationDescription)}
          </Text>
        </Stack>
        {lifetime.refreshTokenExpiration && (
          <Stack space={1}>
            <Input
              size="sm"
              type="number"
              name="slidingRefreshTokenLifetime"
              value={lifetime.slidingRefreshTokenLifetime}
              backgroundColor="blue"
              onChange={setLifeTimeLength}
              label={formatMessage(m.inactivityLifetime)}
              errorMessage={formatErrorMessage(
                actionData?.errors
                  ?.slidingRefreshTokenLifetime as unknown as string,
              )}
            />
            <Text variant={'small'}>
              {formatMessage(m.inactivityLifetimeDescription)}
              <br />
              {readableInactivityLifetime}
            </Text>
          </Stack>
        )}
      </Stack>
    </FormCard>
  )
}

export default Lifetime
