import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { Submitted } from '../fields/Submitted'
import { submitted } from '../lib/messages/submitted'
import { useLocale } from '@island.is/localization'
import { Bullet, BulletList } from '@island.is/island-ui/core'

export const SubmittedScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage } = useLocale()

  return (
    <FormScreen
      title={formatMessage(submitted.general.title)}
      intro={
        <BulletList>
          <Bullet>{formatMessage(submitted.bullets.first)}</Bullet>
          <Bullet>{formatMessage(submitted.bullets.second)}</Bullet>
        </BulletList>
      }
    >
      <Submitted {...props} />
    </FormScreen>
  )
}
