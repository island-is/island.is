import { Box, Bullet, BulletList, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'

import { FieldBaseProps } from '@island.is/application/types'
import InstitutionIllustration from '../../assets/InstitutionIllustration'
import { formatText } from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const ConfirmationScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmationBulletFirst,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmationBulletSecond,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionConfirmationtBulletThird,
              application,
              formatMessage,
            )}
          </Bullet>
        </BulletList>
        <Box display="flex" justifyContent="center" size={1}>
          <InstitutionIllustration />
        </Box>
      </Stack>
    </Box>
  )
}

export default ConfirmationScreen
