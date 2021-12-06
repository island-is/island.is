import React from 'react'
import { BulletList, Bullet, Box } from '@island.is/island-ui/core'
import { formatText, Application } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

interface BulletsData {
  application: Application
}

const Bullets = ({ application }: BulletsData) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginY={5}>
      <BulletList>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletOne,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletTwo,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletThree,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletFour,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletFive,
            application,
            formatMessage,
          )}
        </Bullet>
        <Bullet>
          {formatText(
            m.qualityPhotoInstructionsBulletSix,
            application,
            formatMessage,
          )}
        </Bullet>
      </BulletList>
    </Box>
  )
}

export { Bullets }
