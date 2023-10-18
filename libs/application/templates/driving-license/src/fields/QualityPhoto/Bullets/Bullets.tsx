import { BulletList, Bullet } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

interface BulletsData {
  application: Application
}

export const Bullets = ({ application }: BulletsData) => {
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
