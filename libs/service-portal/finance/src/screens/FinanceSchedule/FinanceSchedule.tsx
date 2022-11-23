import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { PaymentSchedule, Query } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, withClientLocale } from '@island.is/localization'
import {
  ErrorScreen,
  IntroHeader,
  NoDataScreen,
  ServicePortalModuleComponent,
  m as coreMessage,
} from '@island.is/service-portal/core'
import { checkDelegation } from '@island.is/shared/utils'

import FinanceScheduleTable from '../../components/FinanceScheduleTable/FinanceScheduleTable'

export const GET_FINANCE_PAYMENT_SCHEDULES = gql`
  query getPaymentSchedulesQuery {
    getPaymentSchedule {
      myPaymentSchedule {
        nationalId
        paymentSchedules {
          approvalDate
          paymentCount
          scheduleName
          scheduleNumber
          scheduleStatus
          scheduleType
          totalAmount
          unpaidAmount
          unpaidWithInterest
          unpaidCount
          documentID
          downloadServiceURL
        }
      }
    }
  }
`

const FinanceSchedule: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  const isDelegation = checkDelegation(userInfo)

  const {
    data: paymentSchedulesData,
    loading: paymentSchedulesLoading,
    error: paymentSchedulesError,
  } = useQuery<Query>(GET_FINANCE_PAYMENT_SCHEDULES)

  const recordsData: Array<PaymentSchedule> =
    paymentSchedulesData?.getPaymentSchedule?.myPaymentSchedule
      ?.paymentSchedules || []

  const applicationButtonText = formatMessage({
    id: 'sp.finance-schedule:finance-schedule-application',
    defaultMessage: 'Gera greiðsluáætlun',
  })

  if (paymentSchedulesError && !paymentSchedulesLoading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessage.errorTitle)}
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.finance).toLowerCase(),
        })}
      />
    )
  }

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
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={{
          id: 'sp.finance-schedule:title',
          defaultMessage: 'Greiðsluáætlanir',
        }}
        intro={{
          id: 'sp.finance-schedule:intro-text',
          defaultMessage:
            'Hér getur þú gert greiðsluáætlun ef þú vilt dreifa greiðslum á skuld þinni við ríkissjóð og stofnanir. Hér getur þú einnig séð eldri greiðsluáætlanir. Ef Greiðsluáætlunin er greidd hraðar niður en áætlunin segir til um, munu greiðsluseðlar ekki berast þegar hún er upp greidd og engar eftirstöðvar eftir.',
        }}
      />
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
    </Box>
  )
}

export default withClientLocale('sp.finance-schedule')(FinanceSchedule)
