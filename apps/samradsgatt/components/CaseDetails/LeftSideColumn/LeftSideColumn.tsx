import React from 'react'
import { Box, Text, GridContainer, Divider } from '@island.is/island-ui/core'
import CaseBreadcrumbs from './CaseBreadcrumbs'
import CaseTimeline from './CaseTimeline'
import SubscriptionBox from './SubscriptionBox'

interface LeftSideColumnProps {
  caseNumber: string
}

// TODO: change caseNumber when we have data
// TODO: add caseNumber to Timeline props
const LeftSideColumn = ({ caseNumber }: LeftSideColumnProps) => {
  caseNumber = 'Mál nr. 76/2022' // remove
  return (
    <GridContainer>
      <Box>
        <CaseBreadcrumbs caseNumber={caseNumber} />
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
