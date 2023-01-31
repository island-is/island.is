import React from 'react'
import {
  Box,
  Text,
  GridContainer,
  Divider,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import CaseTimeline from './CaseTimeline'
import SubscriptionBox from '../../SubscriptionBox'
import { useLocation } from 'react-use'
import { Case } from '../../../types/viewModels'

interface LeftSideColumnProps {
  chosenCase: Case
}

// TODO: change caseNumber when we have data
// TODO: add caseNumber to Timeline props
const LeftSideColumn = ({ chosenCase }: LeftSideColumnProps) => {
  const location = useLocation()
  return (
    <GridContainer>
      <Box>
        <Box paddingY={3}>
          <Breadcrumbs
            items={[
              { title: 'Öll mál', href: '/samradsgatt' },
              {
                title: 'Mál nr. ' + chosenCase.caseNumber,
                href: location.href,
              },
            ]}
          />
        </Box>
        <Divider />
        <CaseTimeline
          status="Niðurstöður í vinnslu"
          updatedDate={chosenCase.changed}
        />
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
