import React from 'react'
import {
  GridColumn,
  GridRow,
  GridContainer,
  Box,
  Text,
  Breadcrumbs,
  Divider,
} from '@island.is/island-ui/core'
import RightSideColumn from '../../components/CaseDetails/RightSideColumn/RightSideColumn'
import { Case, Advice } from '../../types/viewModels'
import CaseTimeline from '../../../../apps/samradsgatt/components/CaseTimeline/CaseTimeline'
import SubscriptionBox from '../../../../apps/samradsgatt/components/SubscriptionBox/SubscriptionBox'
import { useLocation } from 'react-use'
import CaseOverview from '../../components/CaseOverview/CaseOverview'
import ReviewCard from '../../components/ReviewCard/ReviewCard'
import WriteReviewCard from '../../components/WriteReviewCard/WriteReviewCard'

interface DetailsProps {
  chosenCase: Case
  advices?: Array<Advice>
}

const Details: React.FC<DetailsProps> = ({ chosenCase, advices }) => {
  const location = useLocation()
  const dummyCase = {
    id: 3027,
    caseNumber: '3/2023',
    name:
      'Tilfærsla fasteignaskrár frá Þjóðskrá Íslands til húnæðis og mannvirkja-stofnunar',
    shortDescription:
      'Drög að frumvarpi til laga vegna tilfærslu fasteingaskrár',
    detailedDescription:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea. Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo, fugiat? Corrupti rem expedita magni totam',
    contactName: 'Skrifstofa sveitarfélaga og byggðamála',
    contactEmail: 'irn@irn.is',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    announcementText: 'Lorem ipsum..........',
    summaryDate: null,
    summaryText: null,
    adviceCount: 0,
    created: '2023-01-13T15:46:27.82',
    changed: '2023-01-13T15:47:07.703',
    oldInstitutionName: null,
  }

  const dummyAdvices = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      number: 1,
      participantName: 'Sævar Þór Halldórsson ',
      participantEmail: 'sthh@test.is',
      content: 'Ég styð þetta. Vil að þetta fari í gegn.',
      created: '2023-01-17T14:01:51.040Z',
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      number: 2,
      participantName: 'Þór Jónsson ',
      participantEmail: 'sthh@test.is',
      content: 'Ég er mótfallinn þessu.',
      created: '2023-01-17T14:01:51.040Z',
    },
  ]

  // Remove following lines after connecting to API
  chosenCase = dummyCase
  advices = dummyAdvices

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
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
                Fjöldi umsagna: {chosenCase.adviceCount}
              </Text>
            </Box>
            <SubscriptionBox />
          </GridContainer>
        </GridColumn>

        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <Box paddingLeft={4}>
            <CaseOverview chosenCase={chosenCase} />
            <Box marginBottom={6}>
              <Text variant="h1" color="blue400" paddingY={2}>
                {'Innsendar umsagnir'}
              </Text>
              {advices.map((advice) => {
                return <ReviewCard advice={advice} key={advice.number} />
              })}
            </Box>
            <WriteReviewCard />
          </Box>
        </GridColumn>

        <GridColumn span={'3/12'}>
          <RightSideColumn chosenCase={chosenCase} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
export default Details
