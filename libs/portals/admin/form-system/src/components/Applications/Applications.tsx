import { useContext } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { TableRow } from './components/Table/TableRow'
import { OrganizationSelect } from '../OrganizationSelect'
import { Box, GridRow } from '@island.is/island-ui/core'

import { TableHeader } from './components/Table/TableHeader'

export const Applications = () => {
  const { applications } = useContext(FormsContext)
  return (
    <>
      <GridRow>
        <Box
          marginTop={4}
          marginBottom={8}
          marginRight={1}
          marginLeft={2}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <OrganizationSelect />
        </Box>
      </GridRow>
      <TableHeader />
      {applications?.map((application) => (
        <TableRow
          key={application.id}
          submittedAt={application.submittedAt}
          status={application.status}
        />
      ))}
    </>
  )
}
