import { Box, Bullet, BulletList, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'

import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { PersonsOnComputers } from '@island.is/application/assets/graphics'

const ConfirmationScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmBulletFirst,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmBulletSecond,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmBulletThird,
              application,
              formatMessage,
            )}
          </Bullet>
        </BulletList>
        <Box display="flex" justifyContent="center" size={1}>
          <PersonsOnComputers />
        </Box>
      </Stack>
    </Box>
  )
}

export default ConfirmationScreen
