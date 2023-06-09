import React from 'react'
import { IntroHeader, m, SortableTable } from '@island.is/service-portal/core'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={`${formatMessage(
          m.educationFramhskoliCareer,
        )}: Menntaskólinn við Hamrahlíð`}
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

      <Box marginTop={1} />
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
          {
            id: '123466454666',
            name: 'Saga',
            brautarheiti: 'SAG1036',
            einingar: '3',
            einkunn: '10',
            dags: '23.12.07',
            threp: '1',
            stada: 'Lokið',
            tag: 'mint',
          },
          {
            id: '123466454666777',
            name: 'Skólasókn',
            brautarheiti: 'SKS1001',
            einingar: '1',
            einkunn: '10',
            dags: '23.12.07',
            threp: '1',
            stada: 'Lokið',
            tag: 'mint',
          },
        ]}
        footer={{ name: 'Samtals:', brautarheiti: '', einingar: '11' }}
      />
    </Box>
  )
}

export default EducationGraduationDetail
