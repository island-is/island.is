import React from 'react'
import flatten from 'lodash/flatten'
import { gql, useQuery } from '@apollo/client'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { Table as T } from '@island.is/island-ui/core'
import { Query } from '@island.is/api/schema'
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
import { greidsluStadaHeaders } from '../../utils/dataHeaders'
import {
  exportGreidslustadaCSV,
  exportGreidslustadaXSLX,
} from '../../utils/filesGreidslustada'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'
import { downloadXlsxDocument } from '@island.is/service-portal/graphql'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const FinanceStatus: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()
  const { downloadSheet } = downloadXlsxDocument()

  const { loading, ...statusQuery } = useQuery<Query>(GetFinanceStatusQuery)
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

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-status-title',
            defaultMessage: 'Staða við ríkissjóð og stofnanir',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-status-intro',
                defaultMessage:
                  'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
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
          {financeStatusData?.message && (
            <Box paddingY={2}>
              <AlertBanner
                description={financeStatusData?.message}
                variant="warning"
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
                      Prenta
                    </Button>
                  </Column>
                  <Column width="content">
                    <DropdownExport
                      onGetCSV={() => exportGreidslustadaCSV(financeStatusData)}
                      onGetExcel={() =>
                        downloadSheet({
                          headers: greidsluStadaHeaders,
                          data: exportGreidslustadaXSLX(financeStatusData),
                        })
                      }
                    />
                  </Column>
                </Columns>
              </Hidden>
              <Box marginTop={2}>
                <T.Table>
                  <ExpandHeader
                    data={['Gjaldflokkur / stofnun', 'Umsjónarmaður', 'Staða']}
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
                      data={['Samtals', '', getChargeTypeTotal()]}
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
