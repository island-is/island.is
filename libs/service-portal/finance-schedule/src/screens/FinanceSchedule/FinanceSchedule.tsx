import React from 'react'
import {
  NoDataScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useQuery, gql } from '@apollo/client'
import { PaymentSchedule, Query } from '@island.is/api/schema'
import {
  Box,
  Text,
  Stack,
  GridRow,
  GridColumn,
  SkeletonLoader,
  AlertBanner,
  Button,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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
          unpaidCount
          documentID
          downloadServiceURL
        }
      }
    }
  }
`

const FinanceSchedule: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.finance-schedule')
  const { formatMessage } = useLocale()

  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)

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

  if (paymentSchedulesLoading) {
    return <SkeletonLoader space={1} height={30} repeat={4} />
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
          internal: false,
          text: applicationButtonText,
          variant: 'primary',
          link: '/umsoknir/greidsluaaetlun/',
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
      <Stack space={2}>
        <Text variant="h3" as="h1">
          {formatMessage({
            id: 'sp.finance-schedule:title',
            defaultMessage: 'Greiðsluáætlanir',
          })}
        </Text>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
            <Text variant="default">
              {formatMessage({
                id: 'sp.finance-schedule:intro-text',
                defaultMessage:
                  'Hér getur þú gert greiðsluáætlun ef þú vilt dreifa greiðslum á skuld þinni við ríkissjóð og stofnanir. Hér getur þú einnig séð eldri greiðsluáætlanir. Ef Greiðsluáætlunin er greidd hraðar niður en áætlunin segir til um, munu greiðsluseðlar ekki berast þegar hún er upp greidd og engar eftirstöðvar eftir.',
              })}
            </Text>
          </GridColumn>
          {!isDelegation && (
            <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
              <Box
                paddingRight={2}
                paddingTop={[2, 2, 2, 0]}
                display="flex"
                justifyContent={[
                  'flexStart',
                  'flexStart',
                  'flexStart',
                  'flexEnd',
                ]}
                alignItems="flexEnd"
                height="full"
              >
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
          )}
        </GridRow>

        <Box marginTop={4}>
          {paymentSchedulesError && (
            <AlertBanner
              description={formatMessage({
                id: 'sp.finance-schedule:could-not-fetch-data',
                defaultMessage: 'Ekki tókst að sækja gögn',
              })}
              variant="error"
            />
          )}
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

export default FinanceSchedule
