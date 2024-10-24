import { Bullet, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { externalData } from '../../lib/messages'

export const AgreementDescription = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={2}>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletOne)}
      </Bullet>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletTwo)}
      </Bullet>
      <Bullet>
        {formatMessage(externalData.agreementDescription.bulletThree)}
      </Bullet>
    </Stack>
  )
}
