import React, { FC } from 'react'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
} from '@island.is/island-ui/core'

type ColumnWidth = '6/12' | '4/12' | '2/12'

const columnWidths: ColumnWidth[] = ['6/12', '4/12', '2/12']

const Row: FC<{ values: string[] }> = ({ values }) => (
  <Columns>
    {values.map((value, index) => (
      <Column width={columnWidths[index]} key={index}>
        {value}
      </Column>
    ))}
  </Columns>
)

const SubjectInfo: FC<{}> = () => {
  const [{ userInfo }] = useStore()

  // TODO: The user info object contains our actor atm and not the active subject
  // When a subject is set the token must be updated to our current subject

  return (
    <div>
      <Box marginBottom={7}>
        <Typography variant="h2" as="h2">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={[0, 2]} dividers>
        <Typography variant="h3">Grunnupplýsingar</Typography>
        <Row values={['Nafn', userInfo.actor.name]} />
        <Row values={['Kennitala', userInfo.actor.nationalId]} />
      </Stack>
    </div>
  )
}

export default SubjectInfo
