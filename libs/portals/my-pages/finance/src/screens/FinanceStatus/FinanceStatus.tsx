import subYears from 'date-fns/subYears'
import flatten from 'lodash/flatten'
import { defineMessage } from 'react-intl'

import {
  AlertBanner,
  Box,
  Button,
  GridColumn,
  GridRow,
  Hidden,
  Inline,
  SkeletonLoader,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  ErrorScreen,
  ExpandHeader,
  ExpandRow,
  FJARSYSLAN_SLUG,
  FootNote,
  formSubmit,
  m,
} from '@island.is/portals/my-pages/core'
import { checkDelegation } from '@island.is/shared/utils'

import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'
import { exportGreidslustadaFile } from '../../utils/filesGreidslustada'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from './FinanceStatusData.types'
import * as styles from './Table.css'
import { useUserInfo } from '@island.is/react-spa/bff'
import {
  useGetDebtStatusQuery,
  useGetFinanceStatusQuery,
} from './FinanceStatus.generated'
import { m as messages } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { useFinanceSwapHook } from '../../utils/financeSwapHook'

const FinanceStatus = () => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  useFinanceSwapHook()

  const isDelegation = userInfo && checkDelegation(userInfo)

  const { loading, error, ...statusQuery } = useGetFinanceStatusQuery()

  const { data: debtStatusData, loading: debtStatusLoading } =
    useGetDebtStatusQuery()

  const debtStatus = debtStatusData?.getDebtStatus?.myDebtStatus
  let scheduleButtonVisible = false
  if (debtStatus && debtStatus.length > 0 && !debtStatusLoading) {
    scheduleButtonVisible =
      debtStatus[0]?.approvedSchedule > 0 ||
      debtStatus[0]?.possibleToSchedule > 0
  }

  const financeStatusData: FinanceStatusDataType =
    statusQuery.data?.getFinanceStatus || {}

  const getChargeTypeTotal = () => {
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
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <Stack space={2}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
              {financeStatusData.organizations?.length > 0 ||
              financeStatusZero ? (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="flexStart"
                  printHidden
                >
                  {!isDelegation && scheduleButtonVisible && (
                    <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
                      <a
                        href="/umsoknir/greidsluaaetlun/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          colorScheme="default"
                          icon="receipt"
                          iconType="filled"
                          size="default"
                          type="button"
                          variant="utility"
                          as="span"
                          unfocusable
                        >
                          {formatMessage({
                            id: 'sp.finance-status:make-payment-schedule',
                            defaultMessage: 'Gera greiðsluáætlun',
                          })}
                        </Button>
                      </a>
                    </Box>
                  )}

                  <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
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
                        title: formatMessage({
                          id: 'sp.finance-status:get-debt-certificate',
                          defaultMessage: 'Skuldleysisvottorð',
                        }),
                        href: '/umsoknir/skuldleysisvottord/',
                      },
                      {
                        title: formatMessage(endOfYearMessage, {
                          year: previousYear,
                        }),
                        onClick: () =>
                          formSubmit(
                            `${financeStatusData.downloadServiceURL}${previousYear}?action=annualDoc`,
                          ),
                      },
                      {
                        title: formatMessage(endOfYearMessage, {
                          year: twoYearsAgo,
                        }),
                        onClick: () =>
                          formSubmit(
                            `${financeStatusData.downloadServiceURL}${twoYearsAgo}?action=annualDoc`,
                          ),
                      },
                    ]}
                  />
                </Box>
              ) : null}
            </GridColumn>
          </GridRow>
          <Box marginTop={2}>
            {loading && (
              <Box padding={3}>
                <SkeletonLoader space={1} height={40} repeat={5} />
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
            {financeStatusData?.organizations?.length > 0 ||
            financeStatusZero ? (
              <Box className={styles.printStyle} marginTop={2}>
                <T.Table>
                  <ExpandHeader
                    data={[
                      { value: '', align: 'left' },
                      { value: formatMessage(messages.feeCategory) },
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
      )}
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </Box>
  )
}

export default FinanceStatus
