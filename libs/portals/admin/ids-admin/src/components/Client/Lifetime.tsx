import {
  Box,
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
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

interface LifetimeProps {
  absoluteLifetime: number
  inactivityExpiration: boolean
  inactivityLifetime: number
}

const Lifetime = ({
  absoluteLifetime,
  inactivityLifetime,
  inactivityExpiration,
}: LifetimeProps) => {
  const { formatMessage } = useLocale()
  const [lifetime, setLifetime] = useState({
    absoluteLifetime,
    inactivityExpiration,
    inactivityLifetime,
  })
  const { formatErrorMessage } = useErrorFormatMessage()
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.lifeTime
  >

  useEffect(() => {
    setLifetime({
      absoluteLifetime,
      inactivityExpiration,
      inactivityLifetime,
    })
  }, [absoluteLifetime, inactivityExpiration, inactivityLifetime])

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
      currentValue.get('inactivityExpiration') !==
      originalValue.get('inactivityExpiration')
    ) {
      return true
    }
    if (currentValue.get('inactivityExpiration')) {
      return (
        currentValue.get('absoluteLifetime') !==
          originalValue.get('absoluteLifetime') ||
        currentValue.get('inactivityLifetime') !==
          originalValue.get('inactivityLifetime')
      )
    } else {
      return (
        currentValue.get('absoluteLifetime') !==
        originalValue.get('absoluteLifetime')
      )
    }
  }

  return (
    <ContentCard
      title={formatMessage(m.lifetime)}
      description={formatMessage(m.lifeTimeDescription)}
      onSave={(saveOnAllEnvironments) => {
        return saveOnAllEnvironments
      }}
      isDirty={customChangedValidation}
      intent={ClientFormTypes.lifeTime}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            name="absoluteLifetime"
            value={lifetime.absoluteLifetime}
            backgroundColor="blue"
            onChange={setLifeTimeLength}
            label={formatMessage(m.absoluteLifetime)}
            errorMessage={formatErrorMessage(
              (actionData?.errors?.absoluteLifetime as unknown) as string,
            )}
          />
          <Text variant={'small'}>
            {formatMessage(m.absoluteLifetimeDescription)}
          </Text>
        </Stack>
        <Stack space={1}>
          <ToggleSwitchCheckbox
            label={formatMessage(m.inactivityExpiration)}
            checked={lifetime.inactivityExpiration}
            name="inactivityExpiration"
            value={lifetime.inactivityExpiration.toString()}
            onChange={() =>
              setLifetime((prev) => ({
                ...prev,
                inactivityExpiration: !lifetime.inactivityExpiration,
              }))
            }
          />
          <Text variant={'small'}>
            {formatMessage(m.inactivityExpirationDescription)}
          </Text>
        </Stack>
        <Box hidden={!lifetime.inactivityExpiration}>
          <Stack space={1}>
            <Input
              size="sm"
              type="number"
              name="inactivityLifetime"
              value={lifetime.inactivityLifetime}
              backgroundColor="blue"
              onChange={setLifeTimeLength}
              label={formatMessage(m.inactivityLifetime)}
              errorMessage={formatErrorMessage(
                (actionData?.errors?.inactivityLifetime as unknown) as string,
              )}
            />
            <Text variant={'small'}>
              {formatMessage(m.inactivityLifetimeDescription)}
            </Text>
          </Stack>
        </Box>
      </Stack>
    </ContentCard>
  )
}

export default Lifetime
