import React, { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'

import { AirDiscountSchemeFlightLegsInput } from '@island.is/api/schema'
import {
  Box,
  Stack,
  Hidden,
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  SkeletonLoader,
  Button,
} from '@island.is/island-ui/core'
import { Filters, Panel, Summary, Modal } from './components'
import { isCSVAvailable, downloadCSV } from './utils'
import {
  useConfirmInvoiceMutation,
  useFlightLegsQuery,
} from './Overview.generated'
import { FlightLegsFilters } from './types'

const TODAY = new Date()

const Overview = () => {
  const [showModal, setModal] = useState(false)
  const [filters, setFilters] = useState<FlightLegsFilters>({
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
  })
  const input: AirDiscountSchemeFlightLegsInput = {
    ...filters,
    airline: filters.airline?.value,
    gender: filters.gender?.value || undefined,
    age: {
      from: parseInt(Number(filters.age?.from).toString()) || -1,
      to: parseInt(Number(filters.age?.to).toString()) || 1000,
    },
    postalCode: filters.postalCode
      ? parseInt(filters.postalCode.toString())
      : undefined,
  }
  const [
    confirmInvoice,
    { loading: confirmInvoiceLoading },
  ] = useConfirmInvoiceMutation()

  const { data, loading: queryLoading, refetch } = useFlightLegsQuery({
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })
  const { airDiscountSchemeFlightLegs: flightLegs = [] } = data ?? {}

  const loading = queryLoading || confirmInvoiceLoading
  const applyFilters: SubmitHandler<FlightLegsFilters> = (
    data: FlightLegsFilters,
  ) => {
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
        <GridColumn span={['12/12', '12/12', '5/12', '4/12']} order={1}>
          <Stack space={3}>
            <Box
              background="purple100"
              padding={4}
              marginBottom={3}
              borderRadius="standard"
            >
              <Box marginBottom={2}>
                <Text variant="h4">Síun</Text>
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
                <Text variant="h4">Aðgerðir</Text>
              </Box>
              <Box paddingTop={2}>
                <Button
                  fluid
                  variant="ghost"
                  onClick={() => downloadCSV(flightLegs, filters)}
                  disabled={!isCSVAvailable(filters)}
                >
                  Prenta yfirlit
                </Button>
              </Box>
              <Box paddingTop={3}>
                <Button
                  fluid
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={() => setModal(true)}
                  disabled={!isCSVAvailable(filters)}
                >
                  <Box
                    display="inlineFlex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    Gjaldfæra / Endurgreiða
                  </Box>
                </Button>
              </Box>
            </Box>
          </Stack>
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '7/12', '8/12']} order={[2, 2, 0]}>
          <GridRow>
            {loading ? (
              <GridColumn span={['12/12', '12/12', '12/12', '12/12', '8/9']}>
                <SkeletonLoader height={500} />
              </GridColumn>
            ) : (
              <>
                <GridColumn span={['12/12', '12/12', '12/12', '12/12', '8/9']}>
                  <Hidden below="md">
                    <Summary
                      flightLegs={flightLegs}
                      airline={filters.airline?.value}
                    />
                  </Hidden>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '12/12', '12/12', '8/9']}>
                  <Box marginBottom={[3, 3, 3, 12]}>
                    <Stack space={3}>
                      <Box paddingBottom={2} paddingTop={3}>
                        <Text variant="h3" as="h3">
                          <span>Niðurstaða</span>
                        </Text>
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
          info:
            'Vertu viss um að hafa prentað yfirlitið út frá núverandi síu áður en þú heldur áfram.<br/>Með því að halda áfram, munt þú merkja allar færslur sem annað hvort gjaldfærð eða endurgreidd, eftir því sem á við.',
          buttons: {
            cancel: 'Hætta við',
            continue: 'Halda áfram',
          },
        }}
      />
    </GridContainer>
  )
}

export default Overview
