import {
  Checkbox,
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useReadableSeconds } from '../../../hooks/useReadableSeconds'
import { FormCard } from '../../../components/FormCard/FormCard'
import { useClient } from '../ClientContext'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import {
  AuthAdminClientEnvironment,
  AuthAdminClientSso,
  AuthAdminRefreshTokenExpiration,
} from '@island.is/api/schema'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

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

type LifetimeProps = Pick<
  AuthAdminClientEnvironment,
  | 'sso'
  | 'absoluteRefreshTokenLifetime'
  | 'refreshTokenExpiration'
  | 'slidingRefreshTokenLifetime'
>

const Lifetime = ({
  absoluteRefreshTokenLifetime,
  slidingRefreshTokenLifetime,
  refreshTokenExpiration,
  sso,
}: LifetimeProps) => {
  const { formatMessage } = useLocale()
  const [inputValues, setInputValues] = useEnvironmentState({
    absoluteRefreshTokenLifetime,
    refreshTokenExpiration:
      refreshTokenExpiration === AuthAdminRefreshTokenExpiration.Sliding,
    slidingRefreshTokenLifetime,
    sso: sso,
  })
  const { formatErrorMessage } = useErrorFormatMessage()
  const { actionData, client } = useClient()
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [isSsoSettingsEnabled, setSsoSettingsEnabled] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkSsoSettingsEnabled = async () => {
      const ssoSettingsEnabled = await featureFlagClient.getValue(
        Features.isIDSAdminSsoSettingEnabled,
        false,
      )
      setSsoSettingsEnabled(ssoSettingsEnabled)
      setIsReady(true)
    }

    checkSsoSettingsEnabled()
  }, [featureFlagClient])

  const setLifeTimeLength = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValues((prev) => ({
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
    inputValues.absoluteRefreshTokenLifetime,
  )
  const readableInactivityLifetime = useReadableSeconds(
    inputValues.slidingRefreshTokenLifetime,
  )

  return (
    isReady && (
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
          {isSsoSettingsEnabled && (
            <Stack space={1}>
              <Checkbox
                label={formatMessage(m.allowSSO)}
                backgroundColor="blue"
                large
                defaultChecked={inputValues.sso === AuthAdminClientSso.enabled}
                checked={inputValues.sso === AuthAdminClientSso.enabled}
                name="sso"
                value="true"
                onChange={(e) => {
                  setInputValues({
                    ...inputValues,
                    sso: e.target.checked
                      ? AuthAdminClientSso.enabled
                      : AuthAdminClientSso.disabled,
                  })
                }}
                subLabel={formatMessage(m.allowSSODescription)}
              />
            </Stack>
          )}
          <Stack space={1}>
            <Input
              size="sm"
              type="number"
              name="absoluteRefreshTokenLifetime"
              value={inputValues.absoluteRefreshTokenLifetime}
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
              checked={inputValues.refreshTokenExpiration}
              name="refreshTokenExpiration"
              value={inputValues.refreshTokenExpiration.toString()}
              onChange={() =>
                setInputValues((prev) => ({
                  ...prev,
                  refreshTokenExpiration: !inputValues.refreshTokenExpiration,
                }))
              }
            />
            <Text variant={'small'}>
              {formatMessage(m.inactivityExpirationDescription)}
            </Text>
          </Stack>
          {inputValues.refreshTokenExpiration && (
            <Stack space={1}>
              <Input
                size="sm"
                type="number"
                name="slidingRefreshTokenLifetime"
                value={inputValues.slidingRefreshTokenLifetime}
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
  )
}

export default Lifetime
