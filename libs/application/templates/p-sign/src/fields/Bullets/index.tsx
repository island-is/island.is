import React from 'react'
import { BulletList, Bullet } from '@island.is/island-ui/core'
import { formatText, Application } from '@island.is/application/core'
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
    <BulletList>
      {bullets.map((bullet) => (
        <Bullet>{formatText(bullet, application, formatMessage)}</Bullet>
      ))}
    </BulletList>
  )
}

export default Bullets
