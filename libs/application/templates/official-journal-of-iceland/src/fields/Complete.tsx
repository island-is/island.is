import { useLocale } from '@island.is/localization'
import { OJOIFieldBaseProps } from '../lib/types'
import { Bullet, BulletList } from '@island.is/island-ui/core'
import { CompleteImage } from '../assets/CompleteImage'
import { complete } from '../lib/messages/complete'

export const Complete = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  return (
    <>
      <BulletList>
        <Bullet>{f(complete.bullets.first)}</Bullet>
        <Bullet>{f(complete.bullets.second)}</Bullet>
      </BulletList>
      <CompleteImage />
    </>
  )
}
