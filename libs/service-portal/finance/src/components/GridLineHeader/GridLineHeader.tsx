import React from 'react'

import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './GridLineHeader.treat'

const ExpandableLine = () => {

  const { formatMessage } = useLocale()
  return (
    <>
    <Box
      className={styles.tableHeading}
      paddingY={2}
      paddingX={1}
      background="blue100"
    >
      <GridRow>
        <GridColumn span={['1/1', '4/12']}>
          <Box paddingX={1}>
            <Text variant="eyebrow" fontWeight="semiBold">
              {formatMessage({
                id: 'service.portal:table-header-type',
                defaultMessage: 'Gjaldflokkur / stofnun',
              })}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span={['1/1', '4/12']}>
          <Box paddingX={1}>
            <Text variant="eyebrow" fontWeight="semiBold">
              {formatMessage({
                id: 'service.portal:table-header-name',
                defaultMessage: 'Umsjónarmaður',
              })}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span={['1/1', '4/12']}>
          <Box paddingX={1}>
            <Text variant="eyebrow" fontWeight="semiBold">
              {formatMessage({
                id: 'service.portal:table-header-status',
                defaultMessage: 'Staða',
              })}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
    </>
  )
}

export default ExpandableLine
