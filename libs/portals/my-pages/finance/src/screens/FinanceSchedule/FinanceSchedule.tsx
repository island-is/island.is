import {
  Box,
  Button,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  NoDataScreen,
  m as coreMessage,
  FootNote,
  FJARSYSLAN_SLUG,
} from '@island.is/portals/my-pages/core'
import { checkDelegation } from '@island.is/shared/utils'

import FinanceScheduleTable from '../../components/FinanceScheduleTable/FinanceScheduleTable'
import { useUserInfo } from '@island.is/react-spa/bff'
import { m as messages } from '../../lib/messages'
import FinanceIntro from '../../components/FinanceIntro'
import { useGetPaymentScheduleQuery } from './FinanceSchedule.generated'
import { useFinanceSwapHook } from '../../utils/financeSwapHook'

const FinanceSchedule = () => {
  useNamespaces('sp.finance-schedule')
  useFinanceSwapHook()
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const isDelegation = checkDelegation(userInfo)

  const {
    data: paymentSchedulesData,
    loading: paymentSchedulesLoading,
    error: paymentSchedulesError,
  } = useGetPaymentScheduleQuery()

  const recordsData =
    paymentSchedulesData?.getPaymentSchedule?.myPaymentSchedule
      ?.paymentSchedules || []

  const applicationButtonText = formatMessage(messages.scheduleApplication)

  if (
    recordsData.length <= 0 &&
    !paymentSchedulesLoading &&
    !paymentSchedulesError
  ) {
    return (
      <NoDataScreen
        title={formatMessage({
          id: 'sp.finance-schedule:finance-schedules-empty-title',
          defaultMessage: 'Greiðsluáætlanir',
        })}
        button={{
          type: 'external',
          text: applicationButtonText,
          variant: 'primary',
          link: '/umsoknir/greidsluaaetlun/',
          icon: { icon: 'receipt', type: 'outline' },
        }}
      >
        <Text>
          {formatMessage({
            id: 'sp.finance-schedule:finance-schedules-empty-text',
            defaultMessage:
              'Þú ert ekki með neinar virkar greiðsluáætlanir. Ef þú vilt gera greiðsluáætlun þá getur þú hafið það ferli með því að ýta á hnappinn hér að neðan.',
          })}
        </Text>
      </NoDataScreen>
    )
  }

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <FinanceIntro
        text={formatMessage({
          id: 'sp.finance-schedule:intro-text',
          defaultMessage:
            'Hér getur þú gert greiðsluáætlun ef þú vilt dreifa greiðslum á skuld þinni við ríkissjóð og stofnanir. Hér getur þú einnig séð eldri greiðsluáætlanir. Ef Greiðsluáætlunin er greidd hraðar niður en áætlunin segir til um, munu greiðsluseðlar ekki berast þegar hún er upp greidd og engar eftirstöðvar eftir.',
        })}
      />
      {paymentSchedulesError && !paymentSchedulesLoading && (
        <ErrorScreen
          figure="./assets/images/hourglass.svg"
          tagVariant="red"
          tag={formatMessage(coreMessage.errorTitle)}
          title={formatMessage(coreMessage.somethingWrong)}
          children={formatMessage(coreMessage.errorFetchModule, {
            module: formatMessage(coreMessage.finance).toLowerCase(),
          })}
        />
      )}
      {!paymentSchedulesError && (
        <Stack space={2}>
          {!isDelegation && (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
                <Box display="flex" height="full">
                  <a
                    href="/umsoknir/greidsluaaetlun/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      colorScheme="default"
                      icon="receipt"
                      iconType="filled"
                      preTextIconType="outline"
                      size="default"
                      type="button"
                      variant="utility"
                      as="span"
                      unfocusable
                    >
                      {applicationButtonText}
                    </Button>
                  </a>
                </Box>
              </GridColumn>
            </GridRow>
          )}
          <Box marginTop={4}>
            {paymentSchedulesLoading && !paymentSchedulesError && (
              <Box padding={3}>
                <SkeletonLoader space={1} height={40} repeat={5} />
              </Box>
            )}

            {recordsData.length > 0 ? (
              <FinanceScheduleTable recordsArray={recordsData} />
            ) : null}
          </Box>
        </Stack>
      )}
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </Box>
  )
}

export default FinanceSchedule
