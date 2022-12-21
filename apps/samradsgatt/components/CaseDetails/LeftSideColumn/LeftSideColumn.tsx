import React from 'react'
import { Box, Text, GridContainer, Divider } from '@island.is/island-ui/core'
import CaseBreadcrumbs from './CaseBreadcrumbs'
import CaseTimeline from './CaseTimeline'
import SubscriptionBox from './SubscriptionBox'

const LeftSideColumn = () => {
  return (
    <GridContainer>
      <Box>
        <CaseBreadcrumbs />
        <Divider />
        <CaseTimeline />
      </Box>
      <Box
        marginBottom={6}
        borderBottomWidth={'standard'}
        borderTopWidth={'standard'}
        borderColor={'blue200'}
        paddingY={2}
        paddingLeft={1}
      >
        <Text variant="h3" color="purple400">
          {'Fjöldi umsagna: X'}
        </Text>
      </Box>
      <SubscriptionBox />
    </GridContainer>
  )
}

export default LeftSideColumn
