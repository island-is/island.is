import React, { FC } from 'react'

import { Application,formatText } from '@island.is/application/core'
import { Bullet,BulletList } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'

interface BulletsData {
  application: Application
}

const Bullets = ({ application }: BulletsData) => {
  const { formatMessage } = useLocale()
  return (
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
  )
}

export { Bullets }
