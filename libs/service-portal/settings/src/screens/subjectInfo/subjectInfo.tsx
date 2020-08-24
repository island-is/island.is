import React, { FC } from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

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

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { profile } = userInfo.user

  return (
    <div>
      <Box marginBottom={7}>
        <Typography variant="h2" as="h2">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={[0, 2]} dividers>
        <Typography variant="h3">Grunnupplýsingar</Typography>
        {/* <Row values={['Nafn', profile.name]} />
        <Row values={['Kennitala', profile.natreg]} /> */}
      </Stack>
    </div>
  )
}

export default SubjectInfo
