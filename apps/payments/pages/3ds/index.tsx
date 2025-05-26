import { LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentCompleteIcon } from '../../components/PaymentCompleteIcon'
import { threeDSecure } from '../../messages'
import { withLocale } from '../../i18n/withLocale'

// eslint-disable-next-line func-style
function ThreeDSecureSuccessPage() {
  const { formatMessage } = useLocale()

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%',
      }}
    >
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

export default withLocale(ThreeDSecureSuccessPage)
