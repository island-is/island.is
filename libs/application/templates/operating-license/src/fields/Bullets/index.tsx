import React from 'react'
import { formatText } from '@island.is/application/core'
import { BulletList, Bullet } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface BulletsData {
  application: Application
}

const Bullets = ({ application }: BulletsData) => {
  const { formatMessage } = useLocale()
  const bullets = [
    m.attachmentsBulletOne,
    m.attachmentsBulletTwo,
    m.attachmentsBulletThree,
    m.attachmentsBulletFour,
  ]
  return (
    <BulletList>
      {bullets.map((bullet, i) => (
        <Bullet key={i}>
          {formatText(bullet, application, formatMessage)}
        </Bullet>
      ))}
    </BulletList>
  )
}

export { Bullets }
