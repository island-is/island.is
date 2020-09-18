import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { SubmitHandler } from 'react-hook-form'

import { NotFound } from '@island.is/air-discount-scheme-web/screens'
import { Airlines } from '@island.is/air-discount-scheme/consts'
import { UserContext } from '@island.is/air-discount-scheme-web/context'
import {
  Box,
  Stack,
  Hidden,
  Typography,
  GridRow,
  GridColumn,
  GridContainer,
  SkeletonLoader,
  Button,
} from '@island.is/island-ui/core'
import { Filters, Panel, Summary } from './components'
import { FilterInput } from './consts'
import { Screen } from '../../types'

const FlightLegsQuery = gql`
  query FlightLegsQuery($input: FlightLegsInput!) {
    flightLegs(input: $input) {
      id
      travel
      airline
      originalPrice
      discountPrice
      financialState
      flight {
        id
        bookingDate
        userInfo {
          age
          gender
          postalCode
        }
      }
    }
  }
`

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
  const { data, loading } = useQuery(FlightLegsQuery, {
    ssr: false,
    variables: {
      input: {
        ...filters,
        airline:
          filters.airline?.value === Airlines.norlandair
            ? [Airlines.icelandair, Airlines.norlandair]
            : filters.airline?.value,
        gender:
          filters.gender?.length === 2 ? undefined : (filters.gender || [])[0],
        age: {
          from: parseInt(Number(filters.age?.from).toString()) || -1,
          to: parseInt(Number(filters.age?.to).toString()) || 1000,
        },
        postalCode: filters.postalCode
          ? parseInt(filters.postalCode.toString())
          : undefined,
      },
    },
  })
  const { flightLegs = [] } = data ?? {}

  if (!user) {
    return null
  } else if (!['admin', 'developer'].includes(user?.role)) {
    return <NotFound />
  }

  const applyFilters: SubmitHandler<FilterInput> = (data: FilterInput) => {
    setFilters(data)
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '7/12', '8/12', '9/12']}
          order={[0, 0, 2]}
        >
          <Hidden above="sm">
            {!loading && (
              <Summary
                flightLegs={flightLegs}
                airline={filters.airline?.value}
              />
            )}
          </Hidden>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']} order={1}>
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
        </GridColumn>

        <GridColumn
          span={['12/12', '12/12', '7/12', '8/12', '9/12']}
          order={[2, 2, 0]}
        >
          <GridRow>
            {loading ? (
              <GridColumn
                span={['12/12', '12/12', '12/12', '12/12', '7/9']}
                offset={[null, null, null, null, '1/9']}
              >
                <SkeletonLoader height={500} />
              </GridColumn>
            ) : (
              <>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '12/12', '7/9']}
                  offset={[null, null, null, null, '1/9']}
                >
                  <Hidden below="md">
                    <Summary
                      flightLegs={flightLegs}
                      airline={filters.airline?.value}
                    />
                  </Hidden>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '12/12', '7/9']}
                  offset={[null, null, null, null, '1/9']}
                >
                  <Box marginBottom={[3, 3, 3, 12]}>
                    <Stack space={3}>
                      <Box paddingBottom={2} paddingTop={3}>
                        <Typography variant="h3" as="h3">
                          <span>Niðurstaða</span>
                        </Typography>
                      </Box>

                      <Panel filters={filters} flightLegs={flightLegs} />
                    </Stack>
                  </Box>
                </GridColumn>
              </>
            )}
          </GridRow>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

Admin.getInitialProps = () => ({})

export default Admin
