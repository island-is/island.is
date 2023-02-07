import React from 'react'
import {
  Box,
  Text,
  GridContainer,
  Divider,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import CaseTimeline from './CaseTimeline'
import SubscriptionBox from '../../SubscriptionBox/SubscriptionBox'
import { useLocation } from 'react-use'

interface LeftSideColumnProps {
  caseNumber: string
}

// TODO: change caseNumber when we have data
// TODO: add caseNumber to Timeline props
const LeftSideColumn = ({ caseNumber }: LeftSideColumnProps) => {
  const location = useLocation()
  return (
    <GridContainer>
      <Box>
        <Box paddingY={3}>
          <Breadcrumbs
            items={[
              { title: 'Öll mál', href: '/samradsgatt' },
              { title: 'Mál nr. ' + caseNumber, href: location.href },
            ]}
          />
        </Box>
        <Divider />
        <CaseTimeline status="Niðurstöður í vinnslu" />
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
