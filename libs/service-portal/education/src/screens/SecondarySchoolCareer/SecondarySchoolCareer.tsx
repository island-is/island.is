import React from 'react'
import { IntroHeader, m, SortableTable } from '@island.is/service-portal/core'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'

export const EducationGraduationDetail = () => {
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationFramhskoliCareer}
        intro="Hér getur þú séð yfirlit yfir námsferil þinn úr framhaldsskóla."
      />
      <GridRow marginTop={4}>
        <GridColumn span="1/1">
          <Box
            display="flex"
            justifyContent="flexStart"
            printHidden
            marginBottom={4}
          >
            <Button
              colorScheme="default"
              icon="document"
              iconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              Sækja skjal
            </Button>
          </Box>
        </GridColumn>
      </GridRow>
      <SortableTable
        title="Matsönn 2006 - Fjölbraut við Ármúla - Dagskóli"
        labels={{
          name: 'Námsgrein',
          brautarheiti: 'Brautarheiti',
          einingar: 'Einingar',
          einkunn: 'Einkunn',
          dags: 'Dags.',
          threp: 'Þrep',
          Staða: 'Staða',
        }}
        items={[
          {
            id: '123',
            name: 'Bókfærsla',
            brautarheiti: 'BÓK103',
            einingar: '3',
            einkunn: '9',
            dags: '03.12.07',
            threp: '3',
            Staða: 'Lokið',
          },
        ]}
        footer={{ name: 'Samtals:', brautarheiti: '', einingar: '3' }}
      />
      <Box marginTop={6} />
      <SortableTable
        title="Haustönn 2007 - Menntaskólinn við Hamrahlíð - Dagskóli"
        labels={{
          name: 'Námsgrein',
          brautarheiti: 'Brautarheiti',
          einingar: 'Einingar',
          einkunn: 'Einkunn',
          dags: 'Dags.',
          threp: 'Þrep',
          stada: 'Staða',
        }}
        items={[
          {
            id: '123',
            name: 'Bókfærsla',
            brautarheiti: 'BÓK103',
            einingar: '3',
            einkunn: '9',
            dags: '03.12.07',
            threp: '3',
            stada: 'Lokið',
            tag: 'mint',
          },
          {
            id: '1234',
            name: 'Lífsleikni',
            brautarheiti: 'LIL1012',
            einingar: '1',
            einkunn: '8',
            dags: '13.12.07',
            threp: '2',
            stada: 'Ólokið',
            tag: 'purple',
          },
          {
            id: '12346',
            name: 'Stærðfræði',
            brautarheiti: 'STÆ1036',
            einingar: '3',
            einkunn: '9',
            dags: '23.12.07',
            threp: '2',
            stada: 'Lokið',
            tag: 'mint',
          },
        ]}
        footer={{ name: 'Samtals:', brautarheiti: '', einingar: '7' }}
      />
    </Box>
  )
}

export default EducationGraduationDetail
