import React from 'react'
import { useIntl } from 'react-intl'

import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { summaryForm } from '../../lib/messages'

interface Props {
  name?: string
  nationalId?: string
  address?: string
}

const UserInfo = ({ name, nationalId, address }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box
      paddingY={[4, 4, 5]}
      marginTop={4}
      borderTopWidth="standard"
      borderColor="blue300"
    >
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <Box>
            <Text fontWeight="semiBold">
              {formatMessage(summaryForm.userInfo.name)}
            </Text>
            <Text>{name}</Text>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <Box marginTop={[3, 3, 3, 0]}>
            <Text fontWeight="semiBold">
              {formatMessage(summaryForm.userInfo.nationalId)}
            </Text>
            <Text>{nationalId}</Text>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <Box marginTop={3}>
            <Text fontWeight="semiBold">
              {formatMessage(summaryForm.userInfo.address)}
            </Text>
            <Text>{address}</Text>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default UserInfo
