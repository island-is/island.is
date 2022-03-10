import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import InstitutionIllustration from '../../assets/InstitutionIllustration'
import { confirmation } from '../../lib/messages'

export const ConfirmationScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            {formatText(
              confirmation.general.infoBulletFirst,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              confirmation.general.infoBulletSecond,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              confirmation.general.infoBulletThird,
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
