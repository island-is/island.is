import { FieldBaseProps } from '@island.is/application/core'
import { Box, Bullet, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { delimitation } from '../lib/messages'

export const AgreementDescription: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={2}>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletOne)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletTwo)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletThree)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletFour)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletFive)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletSix)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletSeven)}
        </Bullet>
        <Bullet>
          {formatMessage(delimitation.labels.agreementDescriptionBulletEight)}
        </Bullet>
      </Stack>
    </Box>
  )
}
