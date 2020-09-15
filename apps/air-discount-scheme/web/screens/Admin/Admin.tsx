import React, { useState, useContext } from 'react'
import { SubmitHandler } from 'react-hook-form'

import { Layout } from '@island.is/air-discount-scheme-web/components'
import { Airlines } from '@island.is/air-discount-scheme/consts'
import { NotFound } from '@island.is/air-discount-scheme-web/screens'
import { UserContext } from '@island.is/air-discount-scheme-web/context'
import {
  Box,
  Stack,
  Typography,
  GridRow,
  GridColumn,
  Button,
} from '@island.is/island-ui/core'
import { Filters, Panel } from './components'
import { FilterInput } from './consts'
import { Screen } from '../../types'

const TODAY = new Date()

const Admin: Screen = ({}) => {
  const { user } = useContext(UserContext)
  const [filters, setFilters] = useState<FilterInput>({
    state: [],
    period: {
      from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0),
      to: TODAY,
    },
  } as any)

  if (!user) {
    return null
  } else if (!['admin', 'developer'].includes(user?.role)) {
    return <NotFound />
  }

  const applyFilters: SubmitHandler<FilterInput> = (data: FilterInput) => {
    setFilters(data)
  }

  return (
    <Layout
      main={
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '7/9']}
            offset={[null, null, null, null, '1/9']}
          >
            <Box marginBottom={[3, 3, 3, 12]}>
              <Panel filters={filters} />
            </Box>
          </GridColumn>
        </GridRow>
      }
      aside={
        <Stack space={3}>
          <Box
            background="purple100"
            padding={4}
            marginBottom={3}
            borderRadius="standard"
          >
            <Box marginBottom={2}>
              <Typography variant="h4">Síun</Typography>
            </Box>
            <Filters onSubmit={applyFilters} defaultValues={filters} />
          </Box>
          <Box
            background="purple100"
            padding={4}
            marginBottom={3}
            borderRadius="standard"
          >
            <Box marginBottom={2}>
              <Typography variant="h4">Aðgerðir</Typography>
            </Box>
            <Box paddingTop={2}>
              <Button width="fluid" variant="ghost">
                Prenta yfirlit
              </Button>
            </Box>
          </Box>
        </Stack>
      }
    />
  )
}

Admin.getInitialProps = () => ({})

export default Admin
