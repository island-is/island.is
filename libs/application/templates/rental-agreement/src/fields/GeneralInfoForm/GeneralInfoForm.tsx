import { Bullet, BulletList, Text } from '@island.is/island-ui/core'
import * as m from '../../lib/messages'
import { useIntl } from 'react-intl'

const GeneralInfoForm = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Text variant="intro" marginBottom={4}>
        {formatMessage(m.prerequisites.intro.subTitle)}
      </Text>
      <BulletList type="ul" space={2}>
        <Bullet>
          {formatMessage(m.prerequisites.intro.descriptionBullet1)}
        </Bullet>
        <Bullet>
          {formatMessage(m.prerequisites.intro.descriptionBullet2)}
        </Bullet>
        <Bullet>
          {formatMessage(m.prerequisites.intro.descriptionBullet3)}
        </Bullet>
        <Bullet>
          {formatMessage(m.prerequisites.intro.descriptionBullet4)}
        </Bullet>
        <Bullet>
          {formatMessage(m.prerequisites.intro.descriptionBullet5)}
        </Bullet>
      </BulletList>
    </>
  )
}

export default GeneralInfoForm
