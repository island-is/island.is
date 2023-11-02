import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
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
import { useConfirmInvoiceMutation } from './Overview.generated'

import { airDiscountSchemeNavigation } from '../../lib/navigation'
import Modal from '../../components/Modal/Modal'
import { OverviewLoaderReturnType } from './Overview.loader'

const Overview = () => {
  const { flightLegs, filters } = useLoaderData() as OverviewLoaderReturnType
  const [showModal, setModal] = useState(false)
  const [confirmInvoice, { loading }] = useConfirmInvoiceMutation()

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
                <Filters defaultValues={filters} />
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
                airline={filters.airline}
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
          confirmInvoice({ variables: { input: filters } })
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

export default Overview
