import React from 'react'

import { BulletList, Bullet } from '@island.is/island-ui/core'
import { formatText, Application } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface BulletsData {
  application: Application
}

const Bullets = ({ application }: BulletsData) => {
  const { formatMessage } = useLocale()
  return (
    <BulletList>
      <Bullet>
        {formatText(m.attachmentsBulletOne, application, formatMessage)}
      </Bullet>
      <Bullet>
        {formatText(m.attachmentsBulletTwo, application, formatMessage)}
      </Bullet>
      <Bullet>
        {formatText(m.attachmentsBulletThree, application, formatMessage)}
      </Bullet>
      <Bullet>
        {formatText(m.attachmentsBulletFour, application, formatMessage)}
      </Bullet>
    </BulletList>
  )
}

export { Bullets }
