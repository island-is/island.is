import React from 'react'
import {
  GridColumn,
  GridRow,
  GridContainer,
  Box,
  Text,
  Breadcrumbs,
  Divider,
  CategoryCard,
} from '@island.is/island-ui/core'
import { Case, Advice } from '../../types/viewModels'
import CaseTimeline from '../../../../apps/samradsgatt/components/CaseTimeline/CaseTimeline'
import SubscriptionBox from '../../../../apps/samradsgatt/components/SubscriptionBox/SubscriptionBox'
import { useLocation } from 'react-use'
import { CaseOverview, ReviewCard, WriteReviewCard } from '../../components'
import Layout from '../../components/Layout/Layout'

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
      'Frumvarp þetta mælir fyrir um breytingar á lögum vegna flutnings fasteignaskrár frá Þjóðskrá Íslands til Húsnæðis- og mannvirkjastofnunar. Tilfærslan hefur og fyrst og fremst þann tilgang að þjónusta á vegum hins opinbera á sviði húsnæðismála verður aukin og samhæfð, ásamt því sem breytingin veitir stjórnvöldum aukna yfirsýn til að gera markvissari aðgerðir til að ná jafnvægi á húsnæðismarkaði. Þjóðskrá Íslands mun áfram veita öfluga þjónustu við skráningu einstaklinga í grunnskrám landsins og veitir breytingin jafnframt tækifæri til að skilgreina framtíðarsýn Þjóðskrár með skýrum hætti og með skýrum skilum á milli stofnananna. Í frumvarpinu eru lagðar til breytingar á lögum um skráningu og mat fasteigna nr. 6/2001, lögum um Þjóðskrá Íslands nr. 70/2018 og lögum um Húsnæðis- og mannvirkjastofnun nr. 137/2019, í þeim tilgangi að færa ábyrgð á fasteignaskrá frá Þjóðskrá Íslands til Húsnæðis- og mannvirkjastofnunar. Er hér aðallega um orðalagsbreytingar að ræða auk þess sem lagt er til að í lögum um Húsnæðis- og mannvirkjastofnun verði verkefni tengd skráningu og mati fasteigna tilgreind.',
    contactName: 'Skrifstofa sveitarfélaga og byggðamála',
    contactEmail: 'irn@irn.is',
    status: 'Til umsagnar',
    institution: 'Innviðaráðuneytið',
    type: 'Drög að frumvarpi til laga',
    policyArea: 'Húsnæðis- og skipulagsmál',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    announcementText:
      'Innviðaráðuneytið birtir til umsagnar drög að frumvarpi til laga um breytingu á ýmsum lagaákvæðum vegna tilfærslu fasteignaskrár frá Þjóðskrá Íslands til Húsnæðis-og mannvirkjastofnunar.',
    summaryDate: null,
    summaryText: null,
    adviceCount: 2,
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
      content: 'Ég styð þetta.',
      created: '2023-01-10T14:01:51.040Z',
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      number: 2,
      participantName: 'Þór Jónsson ',
      participantEmail: 'sthh@test.is',
      content: 'Ég er mótfallinn þessu.',
      created: '2023-01-09T14:01:51.040Z',
    },
  ]

  // Remove following lines after connecting to API
  chosenCase = dummyCase
  advices = dummyAdvices

  return (
    <Layout>
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
            <Box paddingY={8}>
              <Box padding={3}>
                <CategoryCard
                  heading="Skjöl til samráðs"
                  text={chosenCase.shortDescription}
                  // TODO change size from 18 to 16
                />
              </Box>
              <Box padding={3}>
                <CategoryCard
                  heading="Aðillar sem hafa fengið boð um samráð á máli."
                  text="Þetta mál er opið öllum til umsagnar. Skráðu þig inn hér til að skrifa umsögn um málið"
                />
              </Box>
              <Box padding={3}>
                <CategoryCard
                  heading="Ábyrgðaraðili"
                  text={
                    `${chosenCase.contactName}` +
                    ` ` +
                    `${chosenCase.contactEmail}`
                  }
                />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}
export default Details
