import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Text, Box, Columns, Column } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'

interface Props {
  title?: MessageDescriptor
  description?: MessageDescriptor
}

export const EmptyState = ({ title, description }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <Box paddingTop={3}>
      <Columns>
        <Column width="3/12">
          <Box paddingLeft="containerGutter">
            <img src="./assets/images/cardboardBox.svg" alt="" />
          </Box>
        </Column>
        <Column width="6/12">
          <Box
            height="full"
            display="flex"
            justifyContent="center"
            flexDirection="column"
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
        </Column>
      </Columns>
    </Box>
  )
}

export default EmptyState
