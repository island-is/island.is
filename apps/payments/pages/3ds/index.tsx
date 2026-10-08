import { GetServerSideProps } from 'next'
import { useEffect } from 'react'

import { LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentCompleteIcon } from '../../components/PaymentCompleteIcon'
import { threeDSecure } from '../../messages'
import { withLocale } from '../../i18n/withLocale'
import { THREE_DS_RESULT_MESSAGE_TYPE } from '../../utils/constants'

interface ThreeDSecurePageProps {
  hasFailed: boolean
}

export const getServerSideProps: GetServerSideProps<
  ThreeDSecurePageProps
> = async (context) => {
  // The card verification callback redirects here with `?status=failed` when the ACS
  // returned an incomplete or invalid result. Resolve it on the server so the failure
  // state never briefly renders the success screen during hydration.
  return {
    props: {
      hasFailed: context.query.status === 'failed',
    },
  }
}

// eslint-disable-next-line func-style
function ThreeDSecurePage({ hasFailed }: ThreeDSecurePageProps) {
  const { formatMessage } = useLocale()

  // This page renders inside the 3DS iframe on the payment page (same origin).
  // Report the outcome so the payment page can stop waiting when it failed.
  useEffect(() => {
    if (window.parent === window) {
      return
    }
    window.parent.postMessage(
      {
        type: THREE_DS_RESULT_MESSAGE_TYPE,
        status: hasFailed ? 'failed' : 'completed',
      },
      window.location.origin,
    )
  }, [hasFailed])

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
      {hasFailed ? (
        <>
          <Text as="h1" variant="h1" marginTop={2}>
            {formatMessage(threeDSecure.failedTitle)}
          </Text>
          <Text marginTop={1} marginBottom={4}>
            {formatMessage(threeDSecure.failedMessage)}
          </Text>
        </>
      ) : (
        <>
          <PaymentCompleteIcon />
          <Text as="h1" variant="h1" marginTop={2}>
            {formatMessage(threeDSecure.title)}
          </Text>
          <Text marginTop={1} marginBottom={4}>
            {formatMessage(threeDSecure.pleaseWait)}
          </Text>
          <LoadingDots />
        </>
      )}
    </div>
  )
}

export default withLocale(ThreeDSecurePage)
