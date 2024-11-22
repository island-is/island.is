import React from 'react'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { Text, Box, Stack, Button, Inline } from '@island.is/island-ui/core'

import KeyValues from '../KeyValues/KeyValues'
import { FlightLeg, TSummary } from '../../types'
import * as styles from './Summary.css'
import { getFilteredFlightLegs } from '../../utils'

interface PropTypes {
  flightLegs: FlightLeg[]
  airline?: string
  onClickRefund: () => void
  onClickDownload: () => void
}

function Summary({
  flightLegs,
  airline: filteredAirline,
  onClickDownload,
  onClickRefund,
}: PropTypes) {
  const sum = (
    arr: FlightLeg[],
    key: 'originalPrice' | 'discountPrice',
  ): number => arr.reduce((acc, item) => acc + item[key], 0)

  const airlines = Object.values(Airlines).filter(
    (airline) => !filteredAirline || airline === filteredAirline,
  )

  return (
    <Box marginBottom={6}>
      <Stack space={3}>
        <Inline justifyContent="spaceBetween" alignY={'bottom'} space={2}>
          <div>
            <Text variant="h1" as="h1">
              Yfirlit
            </Text>
            <Text variant="intro">Samantektin byggist á núverandi síu</Text>
          </div>
          <Inline space={2}>
            <Button
              icon="print"
              variant="utility"
              onClick={onClickDownload}
              disabled={airlines.length === 0}
            >
              Sækja CSV
            </Button>
            <Button
              variant="utility"
              icon="receipt"
              onClick={onClickRefund}
              disabled={airlines.length === 0}
            >
              Gjaldfæra/endurgreiða
            </Button>
          </Inline>
        </Inline>
        <Stack space={3}>
          {airlines.map((airline) => {
            const legs = getFilteredFlightLegs(airline, flightLegs)
            const awaitingCredit = legs.filter(
              (leg) => leg.financialState === States.awaitingCredit,
            )
            const awaitingDebit = legs.filter(
              (leg) => leg.financialState === States.awaitingDebit,
            )
            const sentDebit = legs.filter(
              (leg) => leg.financialState === States.sentDebit,
            )
            const sentCredit = legs.filter(
              (leg) => leg.financialState === States.sentCredit,
            )
            const cancelled = legs.filter(
              (leg) => leg.financialState === States.cancelled,
            )

            const data: TSummary = {
              awaitingCredit: {
                count: awaitingCredit.length,
                discountPrice: sum(awaitingCredit, 'discountPrice'),
                originalPrice: sum(awaitingCredit, 'originalPrice'),
              },
              awaitingDebit: {
                count: awaitingDebit.length,
                discountPrice: sum(awaitingDebit, 'discountPrice'),
                originalPrice: sum(awaitingDebit, 'originalPrice'),
              },
              sentDebit: {
                count: sentDebit.length,
                discountPrice: sum(sentDebit, 'discountPrice'),
                originalPrice: sum(sentDebit, 'originalPrice'),
              },
              sentCredit: {
                count: sentCredit.length,
                discountPrice: sum(sentCredit, 'discountPrice'),
                originalPrice: sum(sentCredit, 'originalPrice'),
              },
              cancelled: {
                count: cancelled.length,
                discountPrice: sum(cancelled, 'discountPrice'),
                originalPrice: sum(cancelled, 'originalPrice'),
              },
            }

            return (
              <Box
                key={airline}
                border="standard"
                borderRadius="default"
                padding={[2, 4]}
              >
                <Stack space={2} key={airline}>
                  <Text variant="h4">
                    <span className={styles.capitalize}>{airline}</span>
                  </Text>
                  <Stack space={3}>
                    <Box
                      background="blue100"
                      borderRadius="default"
                      padding={2}
                    >
                      <KeyValues
                        title="Í gjaldfærslubið"
                        data={data.awaitingDebit}
                      />
                    </Box>
                    <Box padding={2}>
                      <KeyValues
                        title="Í endurgreiðslubið"
                        data={data.awaitingCredit}
                      />
                    </Box>
                    <Box background="red100" borderRadius="default" padding={2}>
                      <KeyValues title="Afturkallaðir" data={data.cancelled} />
                    </Box>
                    <Box
                      padding={2}
                      background="mint100"
                      borderRadius="default"
                    >
                      <KeyValues title="Gjaldfært" data={data.sentDebit} />
                    </Box>
                    <Box
                      background="yellow100"
                      borderRadius="default"
                      padding={2}
                    >
                      <KeyValues title="Endurgreitt" data={data.sentCredit} />
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Summary
