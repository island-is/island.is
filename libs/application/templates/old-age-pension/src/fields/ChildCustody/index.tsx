import React, { FC } from 'react'
import { Table } from '@island.is/application/ui-components'
import { FieldBaseProps } from '@island.is/application/types'
import { childCustodyTableData } from '../../lib/oldAgePensionUtils'
import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../lib/messages'

export const ChildCustodyTable: FC<FieldBaseProps> = ({ application, field }) => {
  const { title, description } = field
  const { formatMessage } = useLocale()
  const { data, columns } = childCustodyTableData(application)

  return (
    <>
      <Text variant="h4" as="h4">
        {formatText(title, application, formatMessage)}
      </Text>
      <Text variant="small">
        {formatText(description!, application, formatMessage)}
      </Text>
      <Box paddingTop={4} paddingBottom={4}>
        <Table columns={columns} data={data} />
      </Box>
      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" > {/*onClick={expandRepeater}*/}
            {formatMessage(oldAgePensionFormMessage.connectedApplications.addChildButton)}
          </Button>
        </Inline>
      </Box>
    </>
  )
}

export default ChildCustodyTable
