import { Box, Bullet, BulletList, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { prerequisites } from '../../lib/messages'

const GeneralInfoForm = () => {
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Text variant="intro" marginBottom={4}>
        {formatMessage(prerequisites.intro.subTitle)}
      </Text>
      <BulletList type="ul" space={2}>
        <Bullet>{formatMessage(prerequisites.intro.descriptionBullet1)}</Bullet>
        <Bullet>{formatMessage(prerequisites.intro.descriptionBullet2)}</Bullet>
        <Bullet>{formatMessage(prerequisites.intro.descriptionBullet3)}</Bullet>
        <Bullet>{formatMessage(prerequisites.intro.descriptionBullet4)}</Bullet>
        <Bullet>{formatMessage(prerequisites.intro.descriptionBullet5)}</Bullet>
      </BulletList>
    </Box>
  )
}
export default GeneralInfoForm
