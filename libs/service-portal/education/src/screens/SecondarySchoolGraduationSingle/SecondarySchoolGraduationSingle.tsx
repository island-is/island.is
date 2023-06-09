import React from 'react'
import {
  IntroHeader,
  m,
  SortableTable,
  UserInfoLine,
} from '@island.is/service-portal/core'
import {
  Box,
  Divider,
  Stack,
  GridRow,
  GridColumn,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { defineMessages } from 'react-intl'
import { EducationPaths } from '../../lib/paths'

export const EducationGraduationDetail = () => {
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title="Menntaskólinn við Hamrahlíð"
        intro="Útskriftargögn nemanda."
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
              Útskriftarskírteini
            </Button>
          </Box>
        </GridColumn>
      </GridRow>
      <Stack space={2}>
        <UserInfoLine
          title="Yfirlit"
          label="Dagsetning úskriftar"
          content="24.11.2007"
        />
        <Divider />

        <UserInfoLine
          label="Einingum lokið"
          content="203"
          editLink={{
            external: false,
            title: {
              id: 'sp.education:view-education-career',
              defaultMessage: 'Skoða námsferil',
            },
            url: EducationPaths.EducationFramhskoliGraduationDetail.replace(
              ':detail',
              'nanar',
            ).replace(':id', 'menntaskolinn-vid-hamrahlid'),
          }}
        />
        <Divider />
        <UserInfoLine
          label="Gráða"
          content="Stúdentspróf, námlok 6 af 3ja þrepi."
        />
        <Divider />
        <UserInfoLine label="Námsbraut" content="Náttúrufræðibraut" />
        <Divider />
        <UserInfoLine label="Skóli" content="Menntaskólinn við Hamrahlíð" />
        <Divider />
      </Stack>

      <Box paddingTop={4}>
        <Text variant="small">
          Ef upplýsingar hér eru ekki réttar er bent á að hafa samband við
          þjónustuaðila, MMS.
        </Text>
      </Box>
    </Box>
  )
}

export default EducationGraduationDetail
