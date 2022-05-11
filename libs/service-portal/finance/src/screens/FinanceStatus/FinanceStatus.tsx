import { gql, useQuery } from '@apollo/client'
import subYears from 'date-fns/subYears'
import flatten from 'lodash/flatten'
import React from 'react'
import { defineMessage } from 'react-intl'

import { Query } from '@island.is/api/schema'
import {
  AlertBanner,
  Box,
  Button,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  ExpandHeader,
  ExpandRow,
  formSubmit,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'
import { exportGreidslustadaFile } from '../../utils/filesGreidslustada'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from './FinanceStatusData.types'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const GetDebtStatusQuery = gql`
  query FinanceStatusGetDebtStatus {
    getDebtStatus {
      myDebtStatus {
        approvedSchedule
        possibleToSchedule
      }
    }
  }
`

const FinanceStatus: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()

  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)

  const { loading, error, ...statusQuery } = useQuery<Query>(
    GetFinanceStatusQuery,
  )

  const { data: debtStatusData, loading: debtStatusLoading } = useQuery<Query>(
    GetDebtStatusQuery,
  )

  const debtStatus = debtStatusData?.getDebtStatus
  let scheduleButtonVisible = false
  if (debtStatus && !debtStatusLoading) {
    scheduleButtonVisible =
      debtStatus.myDebtStatus[0]?.approvedSchedule > 0 ||
      debtStatus.myDebtStatus[0]?.possibleToSchedule > 0
  }

  const financeStatusData: FinanceStatusDataType =
    statusQuery.data?.getFinanceStatus || {}

  function getChargeTypeTotal() {
    const organizationChargeTypes = financeStatusData?.organizations?.map(
      (org) => org.chargeTypes,
    )
    const allChargeTypes = flatten(organizationChargeTypes)

    const chargeTypeTotal =
      allChargeTypes.length > 0
        ? allChargeTypes.reduce((a, b) => a + b.totals, 0)
        : 0

    return amountFormat(chargeTypeTotal)
  }

  const endOfYearMessage = defineMessage({
    id: 'sp.finance-status:end-of-year',
    defaultMessage: 'Staða í lok árs {year}',
    description: 'A welcome message',
  })

  const previousYear = subYears(new Date(), 1).getFullYear().toString()
  const twoYearsAgo = subYears(new Date(), 2).getFullYear().toString()
  const financeStatusZero = financeStatusData?.statusTotals === 0
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h3" as="h1">
          {formatMessage({
            id: 'sp.finance-status:title',
            defaultMessage: 'Staða við ríkissjóð og stofnanir',
          })}
        </Text>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Text variant="default">
              {formatMessage({
                id: 'sp.finance-status:intro',
                defaultMessage:
                  'Hér sérð þú sundurliðun skulda og/eða inneigna hjá ríkissjóði og stofnunum.',
              })}
            </Text>
          </GridColumn>
          {financeStatusData.organizations?.length > 0 || financeStatusZero ? (
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <Box
                display="flex"
                justifyContent="flexEnd"
                marginTop={1}
                printHidden
              >
                {!isDelegation && scheduleButtonVisible && (
                  <Box paddingRight={2}>
                    <a
                      href="/umsoknir/greidsluaaetlun/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        colorScheme="default"
                        icon="receipt"
                        iconType="outline"
                        preTextIconType="outline"
                        size="default"
                        type="button"
                        variant="utility"
                      >
                        {formatMessage({
                          id: 'sp.finance-status:make-payment-schedule',
                          defaultMessage: 'Gera greiðsluáætlun',
                        })}
                      </Button>
                    </a>
                  </Box>
                )}
                <Box paddingRight={2}>
                  <Button
                    colorScheme="default"
                    icon="print"
                    iconType="filled"
                    onClick={() => window.print()}
                    preTextIconType="filled"
                    size="default"
                    type="button"
                    variant="utility"
                  >
                    {formatMessage(m.print)}
                  </Button>
                </Box>
                <DropdownExport
                  onGetCSV={() =>
                    exportGreidslustadaFile(financeStatusData, 'csv')
                  }
                  onGetExcel={() =>
                    exportGreidslustadaFile(financeStatusData, 'xlsx')
                  }
                  dropdownItems={[
                    {
                      title: formatMessage(endOfYearMessage, {
                        year: previousYear,
                      }),
                      onClick: () =>
                        formSubmit(
                          `${financeStatusData.downloadServiceURL}${previousYear}`,
                          true,
                        ),
                    },
                    {
                      title: formatMessage(endOfYearMessage, {
                        year: twoYearsAgo,
                      }),
                      onClick: () =>
                        formSubmit(
                          `${financeStatusData.downloadServiceURL}${twoYearsAgo}`,
                          true,
                        ),
                    },
                  ]}
                />
              </Box>
            </GridColumn>
          ) : null}
        </GridRow>
        <Box marginTop={[3, 4, 4, 4, 5]}>
          {loading && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {error && (
            <Box>
              <AlertBanner
                description={formatMessage(m.errorFetch)}
                variant="error"
              />
            </Box>
          )}
          {financeStatusData?.message && (
            <Box paddingY={2}>
              <AlertBanner
                description={financeStatusData?.message}
                variant="warning"
              />
            </Box>
          )}
          {financeStatusData?.organizations?.length > 0 || financeStatusZero ? (
            <Box marginTop={2}>
              <T.Table>
                <ExpandHeader
                  data={[
                    { value: '', align: 'left' },
                    { value: formatMessage(m.feeCategory) },
                    { value: formatMessage(m.guardian) },
                    { value: formatMessage(m.status), align: 'right' },
                  ]}
                />
                <T.Body>
                  {financeStatusData?.organizations?.map(
                    (org: FinanceStatusOrganizationType, i) =>
                      org.chargeTypes.map((chargeType, ii) => (
                        <FinanceStatusTableRow
                          chargeType={chargeType}
                          organization={org}
                          downloadURL={financeStatusData.downloadServiceURL}
                          key={`${org.id}-${chargeType.id}-${i}-${ii}`}
                        />
                      )),
                  )}
                  <ExpandRow
                    last
                    data={[
                      { value: formatMessage(m.total) },
                      { value: '' },
                      { value: getChargeTypeTotal(), align: 'right' },
                    ]}
                  />
                </T.Body>
              </T.Table>
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceStatus
