import React from 'react'
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
  DropdownMenu,
  SkeletonLoader,
  AlertBanner,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from './FinanceStatusData.types'
import { ExpandHeader } from '../../components/ExpandableTable'
import { downloadCSV } from '../../utils/downloadCSV'
import FinanceStatusTableRow from '../../components/FinanceStatusTableRow/FinanceStatusTableRow'
import * as styles from './FinanceStatus.treat'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const FinanceStatus: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()

  const { loading, ...statusQuery } = useQuery<Query>(GetFinanceStatusQuery)
  const financeStatusData: FinanceStatusDataType =
    statusQuery.data?.getFinanceStatus || {}
  console.log({ financeStatusData, loading })

  const exportCsv = async (data: any) => {
    const filename = `Testcsv, ${new Date().toISOString().split('T')[0]}.csv`

    await downloadCSV(filename, ['header 1', 'header 2'], data)
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
              <Columns space="p2" align="right">
                <Column width="content">
                  <Button
                    colorScheme="default"
                    icon="print"
                    iconType="filled"
                    onClick={function noRefCheck() {}}
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
                          href: '#',
                          title: 'Staða í lok árs ...',
                        },
                        {
                          onClick: () => exportCsv([financeStatusData]),
                          title: 'Sækja sem CSV',
                        },
                        {
                          onClick: function noRefCheck() {},
                          title: 'Sækja sem Excel',
                        },
                      ]}
                      title="Meira"
                    />
                  </Box>
                </Column>
              </Columns>
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
