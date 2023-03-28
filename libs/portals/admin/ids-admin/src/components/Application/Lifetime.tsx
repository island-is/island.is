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
import ContentCard from './ContentCard'
import { AuthApplicationLifeTime } from './Application.loader'

interface LifetimeProps {
  lifetime: AuthApplicationLifeTime
}

const Lifetime = ({ lifetime }: LifetimeProps) => {
  const { formatMessage } = useLocale()
  const [lifeTimeCopy, setLifeTimeCopy] = useState(lifetime)
  const setLifeTimeLength = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLifeTimeCopy((prev) => ({
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
        currentValue.get('absoluteLifeTime') !==
          originalValue.get('absoluteLifeTime') ||
        currentValue.get('inactivityLifeTime') !==
          originalValue.get('inactivityLifeTime')
      )
    } else {
      return (
        currentValue.get('absoluteLifeTime') !==
        originalValue.get('absoluteLifeTime')
      )
    }
  }

  return (
    <ContentCard
      title={formatMessage(m.lifeTime)}
      onSave={(saveOnAllEnvironments) => {
        return saveOnAllEnvironments
      }}
      isDirty={customChangedValidation}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            name="absoluteLifeTime"
            value={lifeTimeCopy.absoluteLifeTime}
            backgroundColor="blue"
            onChange={setLifeTimeLength}
            label={formatMessage(m.absoluteLifetime)}
          />
          <Text variant={'small'}>
            {formatMessage(m.absoluteLifetimeDescription)}
          </Text>
        </Stack>
        <Stack space={1}>
          <ToggleSwitchCheckbox
            label={formatMessage(m.inactivityExpiration)}
            checked={lifeTimeCopy.inactivityExpiration}
            name="inactivityExpiration"
            value={lifeTimeCopy.inactivityExpiration.toString()}
            onChange={() =>
              setLifeTimeCopy((prev) => ({
                ...prev,
                inactivityExpiration: !lifeTimeCopy.inactivityExpiration,
              }))
            }
          />
          <Text variant={'small'}>
            {formatMessage(m.inactivityExpirationDescription)}
          </Text>
        </Stack>
        <Box hidden={!lifeTimeCopy.inactivityExpiration}>
          <Stack space={1}>
            <Input
              size="sm"
              type="number"
              name="inactivityLifeTime"
              value={lifeTimeCopy.inactivityLifeTime}
              backgroundColor="blue"
              onChange={setLifeTimeLength}
              label={formatMessage(m.inactivityLifetime)}
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
