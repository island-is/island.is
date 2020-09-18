import React from 'react'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { FlightLeg } from '@island.is/air-discount-scheme-web/graphql/schema'
import * as styles from './Summary.treat'

type TItem = {
  count: number
  discountPrice: number
  originalPrice: number
}

type TSummary = {
  awaitingDebit: TItem
  awaitingCredit: TItem
  cancelled: TItem
}

interface PropTypes {
  flightLegs: FlightLeg[]
}

function KeyValues({ data, title }: { data: TItem; title: string }) {
  return (
    <Box>
      <Typography variant="eyebrow">{title}</Typography>
      <Box display="flex" alignItems="baseline">
        <Box marginRight={1}>
          <Typography variant="h4">{data.count}</Typography>
        </Box>
        flugleggir
      </Box>
      <Typography color="blue400">
        {data.discountPrice.toLocaleString('de-DE')}.- kr.
      </Typography>
      <Typography variant="pSmall" color="dark300">
        {data.originalPrice.toLocaleString('de-DE')}.- kr.
      </Typography>
    </Box>
  )
}

function Summary({ flightLegs }: PropTypes) {
  const sum = (arr: FlightLeg[], key: string): number =>
    arr.reduce((acc, item) => acc + item[key], 0)

  return (
    <Box marginBottom={3}>
      <Stack space={3}>
        <Typography variant="h1" as="h1">
          Yfirlit
        </Typography>
        <Typography variant="intro">
          Samantektin byggist á núverandi síu
        </Typography>
        <Stack space={3}>
          {Object.values(Airlines).map((airline) => {
            const legs = flightLegs.filter(
              (flightLeg) => flightLeg.airline === airline,
            )
            const awaitingCredit = legs.filter(
              (leg) => leg.financialState === States.awaitingCredit,
            )
            const awaitingDebit = legs.filter(
              (leg) => leg.financialState === States.awaitingDebit,
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
              cancelled: {
                count: cancelled.length,
                discountPrice: sum(cancelled, 'discountPrice'),
                originalPrice: sum(cancelled, 'originalPrice'),
              },
            }

            return (
              <Stack space={1} key={airline}>
                <Typography variant="h3">
                  <span className={styles.capitalize}>{airline}</span>
                </Typography>
                <Box display="flex" justifyContent="spaceBetween">
                  <KeyValues
                    title="Í gjaldfærslubið"
                    data={data.awaitingDebit}
                  />
                  <KeyValues
                    title="Í endurgreiðslubið"
                    data={data.awaitingCredit}
                  />
                  <KeyValues title="Afturkallaðir" data={data.cancelled} />
                </Box>
              </Stack>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Summary
