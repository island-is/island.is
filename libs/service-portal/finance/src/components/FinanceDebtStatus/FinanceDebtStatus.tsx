import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'

import {
  Text,
  Box,
  Blockquote,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'

interface Props {
  debtStatusData: any
}

const FinanceDebtStatus: FC<React.PropsWithChildren<Props>> = ({
  debtStatusData,
}) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.finance-schedule')

  return (
    <Box paddingBottom={7}>
      <Blockquote>
        <GridContainer position="relative">
          <GridRow>
            <GridColumn span="5/12" offset="1/12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text fontWeight="semiBold">
                  {formatMessage({
                    id: 'sp.finance-schedule:debt-status',
                    defaultMessage: 'Staða við ríkissjóð og stofnanir',
                  })}
                </Text>
                <Text>{debtStatusData.totalAmount?.toString()}</Text>
              </Box>
            </GridColumn>
            <GridColumn span="5/12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text fontWeight="semiBold">
                  {formatMessage({
                    id: 'sp.finance-schedule:not-scheduled',
                    defaultMessage: 'Ekki búið að semja um',
                  })}
                </Text>
                <Text>{debtStatusData.possibleToSchedule?.toString()}</Text>
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="5/12" offset="1/12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text fontWeight="semiBold">
                  {formatMessage({
                    id: 'sp.finance-schedule:schedule-approved',
                    defaultMessage: 'Greiðsluáætlun samþykkt',
                  })}
                </Text>
                <Text>{debtStatusData.approvedSchedule?.toString()}</Text>
              </Box>
            </GridColumn>
            <GridColumn span="5/12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text fontWeight="semiBold">
                  {formatMessage({
                    id: 'sp.finance-schedule:cant-schedule',
                    defaultMessage: 'Ekki hægt að semja um',
                  })}
                </Text>
                <Text>{debtStatusData.notPossibleToSchedule?.toString()}</Text>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Blockquote>
    </Box>
  )
}

export default FinanceDebtStatus
