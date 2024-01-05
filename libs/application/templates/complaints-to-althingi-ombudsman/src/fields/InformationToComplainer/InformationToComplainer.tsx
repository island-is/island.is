import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Bullet, BulletList } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { informationToComplainer } from '../../lib/messages'

export const InformationToComplainer: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <BulletList type="ul">
        <Bullet>
          {formatText(
            informationToComplainer.general.bulletOne,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            informationToComplainer.general.bulletTwo,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            informationToComplainer.general.bulletThree,
            application,
            formatMessage,
          )}
        </Bullet>
      </BulletList>
    </Box>
  )
}
