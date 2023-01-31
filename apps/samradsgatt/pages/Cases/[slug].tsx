import React from 'react'
import { GridColumn, GridRow, GridContainer } from '@island.is/island-ui/core'
import LeftSideColumn from '../../components/CaseDetails/LeftSideColumn/LeftSideColumn'
import MainColumn from '../../components/CaseDetails/MainColumn/MainColumn'
import RightSideColumn from '../../components/CaseDetails/RightSideColumn/RightSideColumn'
import { Case, Advice } from '../../types/viewModels'

interface DetailsProps {
  chosenCase: Case
  advices?: Array<Advice>
}

const Details: React.FC<DetailsProps> = ({ chosenCase, advices }) => {
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
          <LeftSideColumn chosenCase={chosenCase} />
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <MainColumn chosenCase={chosenCase} advices={advices} />
        </GridColumn>
        <GridColumn span={'3/12'}>
          <RightSideColumn chosenCase={chosenCase} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
export default Details
