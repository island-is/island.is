import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import InstitutionIllustration from '../../assets/InstitutionIllustration'
import { institutionApplicationMessages as m } from '../../lib/messages'

const ConfirmationScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            {formatText(
              m.confirmation.sectionInfoBulletFirst,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionInfoBulletSecond,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              m.confirmation.sectionInfoBulletThird,
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
