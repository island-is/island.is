import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { SubmitHandler } from 'react-hook-form'

import { NotFound } from '@island.is/air-discount-scheme-web/screens'
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
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { Filters, Panel, Summary, Modal } from './components'
import { FilterInput } from './consts'
import { Screen } from '../../types'
import { isCSVAvailable, downloadCSV } from './utils'

const FlightLegsQuery = gql`
  query FlightLegsQuery($input: FlightLegsInput!) {
    flightLegs(input: $input) {
      id
      travel
      airline
      cooperation
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

const ConfirmInvoiceMutation = gql`
  mutation ConfirmInvoiceMutation($input: ConfirmInvoiceInput!) {
    confirmInvoice(input: $input) {
      id
      financialState
    }
  }
`

const TODAY = new Date()

const Admin: Screen = () => {
  const { user } = useContext(UserContext)
  const [showModal, setModal] = useState(false)
  const [filters, setFilters] = useState<FilterInput>({
    nationalId: '',
    state: [],
    period: {
      from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0, 0),
      to: new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate(),
        23,
        59,
        59,
        999,
      ),
    },
  } as any)
  const input = {
    ...filters,
    airline: filters.airline?.value,
    gender:
      filters.gender?.length === 2 ? undefined : (filters.gender || [])[0],
    age: {
      from: parseInt(Number(filters.age?.from).toString()) || -1,
      to: parseInt(Number(filters.age?.to).toString()) || 1000,
    },
    postalCode: filters.postalCode
      ? parseInt(filters.postalCode.toString())
      : undefined,
    isExplicit: Boolean(filters.isExplicit?.length),
  }
  const [confirmInvoice, { loading: confirmInvoiceLoading }] = useMutation(
    ConfirmInvoiceMutation,
  )
  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(FlightLegsQuery, {
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })
  const { flightLegs = [] } = data ?? {}

  if (!user) {
    return null
  } else if (
    !['admin', 'developer'].includes(user?.role) ||
    error?.graphQLErrors.find((err) => err.extensions.code === 'FORBIDDEN')
  ) {
    return <NotFound />
  }

  const loading = queryLoading || confirmInvoiceLoading
  const applyFilters: SubmitHandler<FilterInput> = (data: FilterInput) => {
    setFilters(data)
    refetch()
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
                <Button
                  width="fluid"
                  variant="ghost"
                  onClick={() => downloadCSV(flightLegs, filters)}
                  disabled={!isCSVAvailable(filters)}
                >
                  Prenta yfirlit
                </Button>
              </Box>
              <Box paddingTop={3}>
                <Button
                  width="fluid"
                  variant="redGhost"
                  onClick={() => setModal(true)}
                  disabled={!isCSVAvailable(filters)}
                >
                  <Box
                    display="inlineFlex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box>Gjaldfæra</Box>
                    <Box>Endurgreiða</Box>
                  </Box>
                </Button>
              </Box>
              <Box paddingTop={3}>
                <Button
                  width="fluid"
                  variant="redGhost"
                  onClick={() => window.open('/admin/discount', '_blank')}
                >
                  Handvirkir kóðar
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

                      <Panel flightLegs={flightLegs} />
                    </Stack>
                  </Box>
                </GridColumn>
              </>
            )}
          </GridRow>
        </GridColumn>
      </GridRow>
      <Modal
        show={showModal}
        onCancel={() => setModal(false)}
        onContinue={() => {
          confirmInvoice({ variables: { input } })
          setModal(false)
        }}
        t={{
          title: 'Gjaldfæra og endurgreiða',
          info: 'Vertu viss um að hafa prentað yfirlitið út frá núverandi síu áður en þú heldur áfram.<br/>Með því að halda áfram, munt þú merkja allar færslur sem annað hvort gjaldfærð eða endurgreidd, eftir því sem á við.',
          buttons: {
            cancel: 'Hætta við',
            continue: 'Halda áfram',
          },
        }}
      />
    </GridContainer>
  )
}

Admin.getInitialProps = () => ({})

export default Admin
