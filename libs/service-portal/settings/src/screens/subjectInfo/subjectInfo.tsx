import React, { FC } from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { GET_HELLO_WORLD_GREETING } from '@island.is/service-portal/graphql'
import { useQuery } from '@apollo/client'

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
  const { data } = useQuery(GET_HELLO_WORLD_GREETING, {
    variables: {
      input: {
        name: 'Service Portal Settings Module',
      },
    },
  })

  return (
    <div>
      <Box marginBottom={7}>
        <Typography variant="h2" as="h2">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={[0, 2]} dividers>
        <Typography variant="h3">Grunnupplýsingar</Typography>
        <Row values={['Nafn', profile.name]} />
        <Row values={['Kennitala', profile.natreg]} />
        <Row values={['GraphQL API response:', data?.helloWorld?.message]} />
      </Stack>
    </div>
  )
}

export default SubjectInfo
