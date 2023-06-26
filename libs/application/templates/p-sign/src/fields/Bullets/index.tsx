import React from 'react'
import { BulletList, Bullet, Box } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

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
