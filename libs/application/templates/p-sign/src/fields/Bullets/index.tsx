import React from 'react'

import { Application,formatText } from '@island.is/application/core'
import { Box,Bullet, BulletList } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

interface BulletsData {
  application: Application
}

const bullets = [
  m.qualityPhotoInstructionsBulletOne,
  m.qualityPhotoInstructionsBulletTwo,
  m.qualityPhotoInstructionsBulletThree,
  m.qualityPhotoInstructionsBulletFour,
  m.qualityPhotoInstructionsBulletFive,
]

const Bullets = ({ application }: BulletsData) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginY={4}>
      <BulletList>
        {bullets.map((bullet, i) => (
          <Bullet key={i}>
            {formatText(bullet, application, formatMessage)}
          </Bullet>
        ))}
      </BulletList>
    </Box>
  )
}

export default Bullets
