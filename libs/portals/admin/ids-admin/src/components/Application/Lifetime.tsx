import {
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
import { AuthApplicationLifeTimeList } from './Application.loader'

interface LifetimeProps {
  lifetime: AuthApplicationLifeTimeList
}

const Lifetime = ({ lifetime }: LifetimeProps) => {
  const { formatMessage } = useLocale()
  const [lifeTimeCopy, setLifeTimeCopy] = useState(lifetime)
  const [changed, setChanged] = useState(false)

  const setLifeTimeLength = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLifeTimeCopy((prev) => ({
      ...prev,
      [event.target.name]: +event.target.value,
    }))
  }

  useEffect(() => {
    setChanged(JSON.stringify(lifeTimeCopy) !== JSON.stringify(lifetime))
  }, [lifeTimeCopy, lifetime])

  return (
    <ContentCard
      title={formatMessage(m.lifeTime)}
      onSave={(saveOnAllEnvironments) => {
        console.log(
          'saveOnAllEnvironments: ',
          saveOnAllEnvironments,
          lifeTimeCopy,
        )
      }}
      changed={changed}
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
            value={lifeTimeCopy.inactivityExpiration.toString()}
            onChange={() =>
              setLifeTimeCopy((prev: any) => ({
                ...prev,
                inactivityExpiration: !prev.inactivityExpiration,
              }))
            }
          />
          <Text variant={'small'}>
            {formatMessage(m.inactivityExpirationDescription)}
          </Text>
        </Stack>
        {lifeTimeCopy.inactivityExpiration && (
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
        )}
      </Stack>
    </ContentCard>
  )
}

export default Lifetime
