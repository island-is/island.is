import { LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentCompleteIcon } from '../../components/PaymentCompleteIcon'
import { threeDSecure } from '../../messages'

import * as styles from './index.css'

export default function ThreeDSecureSuccessPage() {
  const { formatMessage } = useLocale()

  return (
    <div className={styles.container}>
      <PaymentCompleteIcon />

      <Text as="h1" variant="h1" marginTop={2}>
        {formatMessage(threeDSecure.title)}
      </Text>
      <Text marginTop={1} marginBottom={4}>
        {formatMessage(threeDSecure.pleaseWait)}
      </Text>

      <LoadingDots />
    </div>
  )
}
