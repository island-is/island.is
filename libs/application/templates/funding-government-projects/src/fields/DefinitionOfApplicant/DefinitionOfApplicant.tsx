import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, BulletList, Bullet } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { definitionOfApplicant } from '../../lib/messages'

export const DefinitionOfApplicant: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <BulletList type="ul">
        <Bullet>
          {formatText(
            definitionOfApplicant.general.bulletOne,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            definitionOfApplicant.general.bulletTwo,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            definitionOfApplicant.general.bulletThree,
            application,
            formatMessage,
          )}
        </Bullet>
      </BulletList>
    </Box>
  )
}
