import {
  Box,
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import { useActionData } from 'react-router-dom'
import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../forms/EditApplication/EditApplication.action'
import { useErrorFormatMessage } from '../../shared/hooks/useFormatErrorMessage'
import { useReadableSeconds } from './ReadableSeconds'

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
  const [lifetime, setLifetime] = useState({
    absoluteRefreshTokenLifetime,
    refreshTokenExpiration,
    slidingRefreshTokenLifetime,
  })
  const { formatErrorMessage } = useErrorFormatMessage()
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.lifeTime
  >

  const setLifeTimeLength = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLifetime((prev) => ({
      ...prev,
      [event.target.name]: +event.target.value,
    }))
  }

  const customChangedValidation = (
    currentValue: FormData,
    originalValue: FormData,
  ): boolean => {
    if (
      currentValue.get('refreshTokenExpiration') !==
      originalValue.get('refreshTokenExpiration')
    ) {
      return true
    }
    if (currentValue.get('refreshTokenExpiration')) {
      return (
        currentValue.get('absoluteRefreshTokenLifetime') !==
          originalValue.get('absoluteRefreshTokenLifetime') ||
        currentValue.get('slidingRefreshTokenLifetime') !==
          originalValue.get('slidingRefreshTokenLifetime')
      )
    } else {
      return (
        currentValue.get('absoluteRefreshTokenLifetime') !==
        originalValue.get('absoluteRefreshTokenLifetime')
      )
    }
  }

  const readableAbsoluteLifetime = useReadableSeconds(
    lifetime.absoluteRefreshTokenLifetime,
  )
  const readableInactivityLifetime = useReadableSeconds(
    lifetime.slidingRefreshTokenLifetime,
  )

  return (
    <ContentCard
      title={formatMessage(m.lifetime)}
      description={formatMessage(m.lifeTimeDescription)}
      isDirty={customChangedValidation}
      intent={ClientFormTypes.lifeTime}
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
              (actionData?.errors
                ?.absoluteRefreshTokenLifetime as unknown) as string,
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
        <Box hidden={!lifetime.refreshTokenExpiration}>
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
                (actionData?.errors
                  ?.slidingRefreshTokenLifetime as unknown) as string,
              )}
            />
            <Text variant={'small'}>
              {formatMessage(m.inactivityLifetimeDescription)}
              <br />
              {readableInactivityLifetime}
            </Text>
          </Stack>
        </Box>
      </Stack>
    </ContentCard>
  )
}

export default Lifetime
