import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Text, Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import EmptyImageSmall from './EmptyImgSmall'

interface Props {
  title?: MessageDescriptor
  description?: MessageDescriptor
}

export const EmptyState = ({ title, description }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <Box paddingTop={[0, 3]}>
      <GridRow>
        <GridColumn
          span={['12/12', '4/12', '4/12', '3/12', '3/12']}
          order={[2, 1]}
        >
          <Box marginTop={[3, 0]} paddingLeft="containerGutter">
            <EmptyImageSmall style={{ maxHeight: 229 }} />
          </Box>
        </GridColumn>
        <GridColumn
          span={['10/12', '4/12']}
          offset={['0', '1/12', '1/12', '1/12', '0']}
          order={[1, 2]}
        >
          <Box
            height="full"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            paddingTop={[3, 0]}
          >
            <Text marginBottom={1} variant="h3">
              {title ? formatMessage(title) : formatMessage(m.noDataFound)}
            </Text>
            <Text marginBottom={1} as="p">
              {description
                ? formatMessage(description)
                : formatMessage(m.noDataFoundDetail)}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default EmptyState
