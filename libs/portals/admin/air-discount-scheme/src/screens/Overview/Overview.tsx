import React, { useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import {
  Box,
  Stack,
  Hidden,
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  SkeletonLoader,
  Divider,
} from '@island.is/island-ui/core'
import { PortalNavigation } from '@island.is/portals/core'
import { Filters, Panel, Summary } from './components'
import { downloadCSV } from './utils'
import {
  FlightLegsQuery,
  FlightLegsQueryVariables,
  useConfirmInvoiceMutation,
  useFlightLegsLazyQuery,
} from './Overview.generated'
import { FlightLegsFilters } from './types'
import { airDiscountSchemeNavigation } from '../../lib/navigation'
import Modal from '../../components/Modal/Modal'
import { prepareFlightLegsQuery } from '../../lib/loaders'
import { useLoaderData } from 'react-router-dom'

const Overview = () => {
  const loaderData = useLoaderData() as FlightLegsQuery
  const { airDiscountSchemeFlightLegs = [] } = loaderData ?? {}
  const [flightLegs, setFlightLegs] = useState(airDiscountSchemeFlightLegs)
  const [showModal, setModal] = useState(false)
  const queryData = prepareFlightLegsQuery()
  const [filters, setFilters] = useState<FlightLegsFilters>(queryData.filters)

  const input: FlightLegsQueryVariables['input'] = {
    ...queryData.input,
    airline: filters.airline?.value,
    gender: filters.gender?.value || undefined,
    age: {
      from:
        parseInt(Number(filters.age?.from).toString()) ||
        queryData.input.age.from,
      to:
        parseInt(Number(filters.age?.to).toString()) || queryData.input.age.to,
    },
    postalCode: filters.postalCode
      ? parseInt(filters.postalCode.toString())
      : undefined,
    isExplicit: Boolean(filters.isExplicit),
  }

  const [
    confirmInvoice,
    { loading: confirmInvoiceLoading },
  ] = useConfirmInvoiceMutation()

  const [
    getFlightLegs,
    { loading: flightLegsLoading, data },
  ] = useFlightLegsLazyQuery({
    ssr: false,
    variables: {
      input,
    },
  })

  useEffect(() => {
    if (data?.airDiscountSchemeFlightLegs) {
      setFlightLegs(data.airDiscountSchemeFlightLegs)
    }
  }, [data?.airDiscountSchemeFlightLegs])

  const loading = flightLegsLoading || confirmInvoiceLoading
  const applyFilters: SubmitHandler<FlightLegsFilters> = (
    data: FlightLegsFilters,
  ) => {
    setFilters(data)
    getFlightLegs()
  }

  return (
    <GridContainer>
      <Hidden above="md">
        <Box paddingBottom={4}>
          <PortalNavigation navigation={airDiscountSchemeNavigation} />
        </Box>
      </Hidden>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Stack space={3}>
            <Hidden below="lg">
              <PortalNavigation navigation={airDiscountSchemeNavigation} />
            </Hidden>
            <Box background="purple100" marginY={3} borderRadius="large">
              <Box paddingX={4} paddingY={3}>
                <Text variant="h4">Síun</Text>
              </Box>
              <Divider weight="purple200" />
              <Box padding={4}>
                <Filters onSubmit={applyFilters} defaultValues={filters} />
              </Box>
            </Box>
          </Stack>
        </GridColumn>

        <GridColumn
          span={['12/12', '12/12', '12/12', '8/12']}
          offset={['0', '0', '0', '0', '1/12']}
        >
          {loading ? (
            <SkeletonLoader height={500} />
          ) : (
            <>
              <Summary
                flightLegs={flightLegs}
                airline={filters.airline?.value}
                onClickDownload={() => downloadCSV(flightLegs, filters)}
                onClickRefund={() => setModal(true)}
              />
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
            </>
          )}
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
