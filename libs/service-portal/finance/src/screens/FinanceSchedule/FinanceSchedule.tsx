import React, { useState } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useQuery, gql } from '@apollo/client'
import { PaymentSchedule, Query } from '@island.is/api/schema'
import { GET_TAPS_QUERY } from '@island.is/service-portal/graphql'
import { m } from '@island.is/service-portal/core'
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
import { FinancePaymentScheduleItem } from './FinanceSchedule.types'

export const GET_FINANCE_DEBT_STATUS = gql`
  query getDebtStatusQuery {
    getDebtStatus
  }
`
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
        }
      }
    }
  }
`

const FinanceSchedule: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-schedule')
  const { formatMessage } = useLocale()

  // const {
  //   data: debtStatusData,
  //   loading: debtStatusLoading,
  //   error: debtStatusError,
  // } = useQuery<Query>(GET_FINANCE_DEBT_STATUS)

  const {
    data: paymentSchedulesData,
    loading: paymentSchedulesLoading,
    error: paymentSchedulesError,
  } = useQuery<Query>(GET_FINANCE_PAYMENT_SCHEDULES)

  const { loading: tabLoading } = useQuery<Query>(GET_TAPS_QUERY)

  const recordsData: Array<PaymentSchedule> =
    paymentSchedulesData?.getPaymentSchedule?.myPaymentSchedule
      ?.paymentSchedules || []
  // const debtData: any = debtStatusData?.getDebtStatus?.myDebtStatus || {}

  if (tabLoading) {
    return <SkeletonLoader space={1} height={30} repeat={4} />
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h3" as="h1">
          {formatMessage({
            id: 'sp.finance-schedule:title',
            defaultMessage: 'Greiðsluáætlun',
          })}
        </Text>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Text variant="default">
              {formatMessage({
                id: 'sp.finance-schedule:intro',
                defaultMessage:
                  'Hér getur þú gert greiðsluáætlun í allt að 12 mánuði ef þú vilt dreifa greiðslum á skuld þinni við ríkissjóð og stofnanir. Hér getur þú einnig séð eldri greiðsluáætlanir. ',
              })}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Box
              paddingRight={2}
              display="flex"
              justifyContent="flexEnd"
              alignItems="flexEnd"
              height="full"
            >
              <a
                href="https://island.is/umsoknir/greidsluaaetlun/"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  colorScheme="default"
                  icon="open"
                  iconType="outline"
                  preTextIconType="outline"
                  size="default"
                  type="button"
                  variant="utility"
                >
                  {formatMessage(m.financeScheduleApplication)}
                </Button>
              </a>
            </Box>
          </GridColumn>
        </GridRow>

        <Box marginTop={4}>
          {paymentSchedulesError && (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          )}
          {paymentSchedulesLoading && !paymentSchedulesError && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {recordsData.length <= 0 &&
            !paymentSchedulesLoading &&
            !paymentSchedulesError && (
              <AlertBanner
                description={formatMessage(m.noResultsTryAgain)}
                variant="warning"
              />
            )}
          {/* {debtData.length > 0 ? (
            <FinanceDebtStatus debtStatusData={debtData[0]} />
          ) : null} */}

          {recordsData.length > 0 ? (
            <FinanceScheduleTable recordsArray={recordsData} />
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceSchedule
