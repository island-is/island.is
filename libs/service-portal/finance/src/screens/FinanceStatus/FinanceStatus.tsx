import React from 'react'
import flatten from 'lodash/flatten'
import { gql, useQuery } from '@apollo/client'
import { ServicePortalModuleComponent, m } from '@island.is/service-portal/core'
import { Table as T } from '@island.is/island-ui/core'
import subYears from 'date-fns/subYears'
import { Query } from '@island.is/api/schema'
import { defineMessage } from 'react-intl'
import {
  Box,
  Text,
  Stack,
  Columns,
  Column,
  Button,
  SkeletonLoader,
  AlertBanner,
  Hidden,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from './FinanceStatusData.types'
import { ExpandHeader, ExpandRow } from '../../components/ExpandableTable'
import amountFormat from '../../utils/amountFormat'
import { exportGreidslustadaFile } from '../../utils/filesGreidslustada'
import { showAnnualStatusDocument } from '@island.is/service-portal/graphql'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import DisabledItem from '../../components/DropdownExport/DisabledItem'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const FinanceStatus: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()
  const {
    showAnnualStatusPdf,
    loadingAnnualPDF,
    fetchingYearPDF,
  } = showAnnualStatusDocument()

  const { loading, error, ...statusQuery } = useQuery<Query>(
    GetFinanceStatusQuery,
  )
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
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.finance-status:title',
            defaultMessage: 'Staða við ríkissjóð og stofnanir',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'sp.finance-status:intro',
                defaultMessage:
                  'Hér er að finna sundurliðun skulda og inneigna við ríkissjóð og stofnanir á þeim degi sem skoðað er.',
              })}
            </Text>
          </Column>
        </Columns>
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
          {!loading &&
            !error &&
            (financeStatusData?.organizations?.length === 0 ||
              financeStatusData?.organizations === null) && (
              <Box paddingY={2}>
                <AlertBanner
                  description="Staða þín við ríkissjóð = 0"
                  variant="info"
                />
              </Box>
            )}
          {financeStatusData?.organizations?.length > 0 ? (
            <>
              <Hidden print={true}>
                <Columns space="p2" align="right">
                  <Column width="content">
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
                  </Column>
                  <Column width="content">
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
                          onClick: () => showAnnualStatusPdf(previousYear),
                          render:
                            loadingAnnualPDF && fetchingYearPDF === previousYear
                              ? () => (
                                  <DisabledItem
                                    title={formatMessage(endOfYearMessage, {
                                      year: previousYear,
                                    })}
                                    loading
                                    key={previousYear}
                                  />
                                )
                              : undefined,
                        },
                        {
                          title: formatMessage(endOfYearMessage, {
                            year: twoYearsAgo,
                          }),
                          onClick: () => showAnnualStatusPdf(twoYearsAgo),
                          render:
                            loadingAnnualPDF && fetchingYearPDF === twoYearsAgo
                              ? () => (
                                  <DisabledItem
                                    title={formatMessage(endOfYearMessage, {
                                      year: twoYearsAgo,
                                    })}
                                    loading
                                    key={twoYearsAgo}
                                  />
                                )
                              : undefined,
                        },
                      ]}
                    />
                  </Column>
                </Columns>
              </Hidden>
              <Box marginTop={2}>
                <T.Table>
                  <ExpandHeader
                    data={[
                      { value: formatMessage(m.feeCategory) },
                      { value: formatMessage(m.guardian) },
                      { value: formatMessage(m.status), align: 'right' },
                    ]}
                  />
                  <T.Body>
                    {financeStatusData.organizations.map(
                      (org: FinanceStatusOrganizationType) =>
                        org.chargeTypes.map((chargeType) => (
                          <FinanceStatusTableRow
                            chargeType={chargeType}
                            organization={org}
                            key={`${org.id}-${chargeType.id}`}
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
            </>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceStatus
