import React from 'react'
import flatten from 'lodash/flatten'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
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
  DropdownMenu,
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
import {
  exportGreidslustadaCSV,
  exportGreidslustadaXSLX,
  greidsluStadaHeaders,
} from '../../utils/filesGreidslustada'
import { downloadXlsx } from '../../utils/downloadFile'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'
import * as styles from './FinanceStatus.treat'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const GetExcelSheetData = gql`
  query GetExcelSheetData($input: ExcelSheetInput!) {
    getExcelDocument(input: $input)
  }
`

const FinanceStatus: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()

  const { loading, ...statusQuery } = useQuery<Query>(GetFinanceStatusQuery)
  const financeStatusData: FinanceStatusDataType =
    statusQuery.data?.getFinanceStatus || {}

  const [loadExcelSheet] = useLazyQuery(GetExcelSheetData, {
    onCompleted: (data) => {
      const xlslData = data?.getExcelDocument || null
      if (xlslData) {
        downloadXlsx(xlslData.file, xlslData.filename)
      } else {
        console.warn('No excel data') // Should warn the user with toast?
      }
    },
  })

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
                    <Box className={styles.buttonWrapper}>
                      <DropdownMenu
                        icon="ellipsisHorizontal"
                        menuLabel="Fleiri möguleikar"
                        items={[
                          {
                            onClick: () =>
                              exportGreidslustadaCSV(financeStatusData),
                            title: 'Sækja sem CSV',
                          },
                          {
                            onClick: () =>
                              loadExcelSheet({
                                variables: {
                                  input: {
                                    headers: greidsluStadaHeaders,
                                    data: exportGreidslustadaXSLX(
                                      financeStatusData,
                                    ),
                                  },
                                },
                              }),
                            title: 'Sækja sem Excel',
                          },
                        ]}
                        title="Meira"
                      />
                    </Box>
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
                      // TODO: Put in separate component :+1:
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
