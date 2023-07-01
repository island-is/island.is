import { FieldBaseProps } from '@island.is/application/types'
import { Bullet, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { externalData } from '../../lib/messages'

export const AgreementDescription: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={2}>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletOne)}
      </Bullet>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletTwo)}
      </Bullet>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletThree)}
      </Bullet>
    </Stack>
  )
}
