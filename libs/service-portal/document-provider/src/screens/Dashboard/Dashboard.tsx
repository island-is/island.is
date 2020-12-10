import React, { useEffect } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { GridRow, GridColumn, Box, Text } from '@island.is/island-ui/core'
import { StatisticBox } from '../../components/StatisticBox/StatisticBox'

const Dashboard: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  useEffect(() => {})

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Text variant="h1" as="h1">
        {formatMessage({
          id: 'service.portal:document-provider',
          defaultMessage: 'Skjalaveita',
        })}
      </Text>
      <Text as="p">
        {formatMessage({
          id: 'sp.document-provider:dashboard-description',
          defaultMessage:
            'Á þessari síðu getur þú skoðað tölfræði yfir send skjöl.',
        })}
      </Text>
      <GridRow>
        <GridColumn span={['12/12', '4/12']}>
          <StatisticBox name="Send skjöl" value={123} />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <StatisticBox name="Opnuð skjöl" value={333} />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <StatisticBox name="Hnipp" value={444} />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default Dashboard
