import { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Inline,
  Stack,
  Table,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'
import { formatCurrency } from '@island.is/web/utils/currency'

import { FineCalculator } from './components/FineCalculator'
import { SpeedMeasurementCalculator } from './components/SpeedMeasurementCalculator'
import { m } from './translation.strings'
import { calculateSpeedMeasurementFine } from './utils'
import * as styles from './FineAndSpeedMeasurementCalculator.css'

const QUARTER_OFF_FINE_MULTIPLIER = 0.75

const DEFAULT_SPEED_LIMIT_OPTIONS = [
  {
    label: '15',
    value: 15,
  },
  {
    label: '30',
    value: 30,
  },
  {
    label: '40',
    value: 40,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '60',
    value: 60,
  },
  {
    label: '70',
    value: 70,
  },
  {
    label: '80',
    value: 80,
  },
  {
    label: '90',
    value: 90,
  },
]

interface JailTimeMapping {
  maxAmount?: number
  days: number
}

interface Fine {
  law: string
  title: string
  subtitle: string
  price: number
  points: number
  maxAmountThatCanBeSelected?: number
  isSpeedMeasurement?: boolean
  akaera?: boolean
}

interface FineState extends Fine {
  amountSelected: number
  id: number
}

interface FineCalculatorDetailsProps {
  fines: FineState[]
  goBack: () => void
  slice: ConnectedComponent
  speedMeasurementData?: {
    points: number
    price: number
    measuredSpeed: number
    vikmork: number
    speedLimit: number
    over3500kgOrWithTrailer: boolean
    akaera: boolean
  }
}

const getJailTimeForAmount = (
  amount: number,
  jailTimeMappings: JailTimeMapping[],
): number => {
  if (amount === 0) return 0
  const descendingOrderedMappings = [...jailTimeMappings].sort((a, b) => {
    return b.days - a.days
  })

  let days = 0

  for (const mapping of descendingOrderedMappings) {
    if (typeof mapping.maxAmount !== 'number') {
      days = mapping.days
    } else if (amount <= mapping.maxAmount) {
      days = mapping.days
    }
  }

  return days
}

const calculateTotalPoints = (fines: FineState[]): number => {
  return fines.reduce((acc, fine) => {
    const amount = fine.amountSelected > 1 ? 1 : fine.amountSelected
    return acc + fine.points * amount
  }, 0)
}

const FineCalculatorDetails = ({
  fines,
  goBack,
  slice,
  speedMeasurementData,
}: FineCalculatorDetailsProps) => {
  const { formatMessage } = useIntl()

  const selectedFines: FineState[] = (
    speedMeasurementData
      ? [
          {
            id:
              fines.reduce((acc, fine) => (acc > fine.id ? acc : fine.id), 0) +
              1,
            amountSelected: 1,
            law: formatMessage(m.results.speedMeasurementLaw),
            points: speedMeasurementData.points,
            price: speedMeasurementData.price,
            title: formatMessage(m.results.speedMeasurementOverviewText, {
              measuredSpeed: speedMeasurementData.measuredSpeed,
              measuredSpeedMinusVikmork:
                speedMeasurementData.measuredSpeed -
                speedMeasurementData.vikmork,
              speedLimit: speedMeasurementData.speedLimit,
            }),
            subtitle: '',
            isSpeedMeasurement: true,
            akaera: speedMeasurementData.akaera,
          } as FineState,
        ]
      : []
  ).concat(fines.filter((fine) => fine.amountSelected > 0))

  const totalFine = selectedFines.reduce(
    (acc, fine) => acc + fine.price * fine.amountSelected,
    0,
  )

  const totalPoints = calculateTotalPoints(selectedFines)

  const jailTime = getJailTimeForAmount(
    totalFine,
    slice.json?.jailTimeMappings ?? [],
  )

  return (
    <Stack space={3}>
      <Inline justifyContent="spaceBetween" alignY="center">
        <Button
          preTextIcon="arrowBack"
          variant="text"
          size="small"
          onClick={goBack}
        >
          {formatMessage(m.results.goBack)}
        </Button>
        {jailTime > 0 && Boolean(slice.configJson?.showJailTime) && (
          <Box paddingLeft={3}>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(m.results.jailTime, { days: jailTime })}
            </Text>
          </Box>
        )}
      </Inline>
      <Table.Table>
        <Table.Head>
          <Table.HeadData>
            {formatMessage(m.results.itemHeading)}
          </Table.HeadData>
          <Table.HeadData align="right">
            {formatMessage(m.results.fineHeading)}
          </Table.HeadData>
          <Table.HeadData align="right">
            {formatMessage(m.results.quarterOfHeading)}
          </Table.HeadData>
          <Table.HeadData align="right">
            {formatMessage(m.results.pointsHeading)}
          </Table.HeadData>
        </Table.Head>
        <Table.Body>
          {selectedFines.map((fine) => (
            <Table.Row key={fine.id}>
              <Table.Data>
                {fine.law} <strong>{fine.title}</strong>
                {fine.isSpeedMeasurement ? '' : ` x ${fine.amountSelected}`}
                {fine.akaera
                  ? ` ${formatMessage(m.results.speedMeasurementAkaera)}`
                  : ''}
              </Table.Data>
              <Table.Data align="right">
                {formatCurrency(fine.price * fine.amountSelected)}
              </Table.Data>
              <Table.Data align="right">
                {formatCurrency(
                  fine.price *
                    fine.amountSelected *
                    QUARTER_OFF_FINE_MULTIPLIER,
                )}
              </Table.Data>
              <Table.Data align="right">{fine.points}</Table.Data>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Data text={{ fontWeight: 'semiBold' }}>
              {formatMessage(m.results.total)}
            </Table.Data>
            <Table.Data align="right" text={{ fontWeight: 'semiBold' }}>
              {formatCurrency(totalFine)}
            </Table.Data>
            <Table.Data align="right" text={{ fontWeight: 'semiBold' }}>
              {formatCurrency(totalFine * QUARTER_OFF_FINE_MULTIPLIER)}
            </Table.Data>
            <Table.Data align="right" text={{ fontWeight: 'semiBold' }}>
              {totalPoints}
            </Table.Data>
          </Table.Row>
        </Table.Foot>
      </Table.Table>
    </Stack>
  )
}

interface FineAndSpeedMeasurementCalculatorProps {
  slice: ConnectedComponent
}

export const FineAndSpeedMeasurementCalculator = ({
  slice,
}: FineAndSpeedMeasurementCalculatorProps) => {
  const [selectedHeadingId, setSelectedHeadingId] = useState<
    'fine' | 'speed-measurement'
  >('fine')
  const [showDetails, setShowDetails] = useState(false)

  const { formatMessage } = useIntl()

  const speedLimitOptions: typeof DEFAULT_SPEED_LIMIT_OPTIONS =
    slice.json?.speedLimitOptions ?? DEFAULT_SPEED_LIMIT_OPTIONS

  const [measuredSpeed, setMeasuredSpeed] = useState('')
  const [speedLimit, setSpeedLimit] = useState(speedLimitOptions[0].value)
  const [over3500kgOrWithTrailer, setOver3500kgOrWithTrailer] = useState(false)

  const [fines, setFines] = useState<FineState[]>(
    slice.json?.fines?.map((fine: Fine, index: number) => ({
      ...fine,
      amountSelected: 0,
      id: index,
    })) ?? [],
  )

  const {
    punktar: speedMeasurementPoints,
    sekt: speedMeasurementPrice,
    vikmork,
    akaera,
  } = calculateSpeedMeasurementFine(
    Number(measuredSpeed),
    speedLimit,
    over3500kgOrWithTrailer,
  )

  const price =
    fines.reduce((acc, fine) => acc + fine.price * fine.amountSelected, 0) +
    (speedMeasurementPrice ?? 0)

  const finePoints = calculateTotalPoints(fines)

  const points = finePoints + (speedMeasurementPoints ?? 0)

  if (showDetails) {
    return (
      <FineCalculatorDetails
        fines={fines}
        goBack={() => setShowDetails(false)}
        slice={slice}
        speedMeasurementData={{
          points: speedMeasurementPoints ?? 0,
          price: speedMeasurementPrice ?? 0,
          measuredSpeed: Number(measuredSpeed),
          vikmork,
          speedLimit,
          over3500kgOrWithTrailer,
          akaera,
        }}
      />
    )
  }

  return (
    <Stack space={3}>
      <Stack space={3}>
        <Box display="flex" justifyContent="flexEnd">
          <Button
            icon="arrowForward"
            variant="text"
            size="small"
            onClick={() => setShowDetails(true)}
            disabled={price === 0}
          >
            {formatMessage(m.fines.calculate)}
          </Button>
        </Box>
        <Box display="flex" justifyContent="flexEnd">
          <Box
            className={styles.totalContainer}
            background="purple100"
            padding={2}
            borderRadius="standard"
          >
            <Text variant="eyebrow">{formatMessage(m.fines.total)}</Text>
            <Stack space={1}>
              <Text textAlign="right" variant="h5">
                {formatCurrency(price)}
              </Text>
              <Text textAlign="right" variant="h5">
                {points}
                {points === 1
                  ? formatMessage(m.fines.pointsPostfixSingular)
                  : formatMessage(m.fines.pointsPostfixPlural)}
              </Text>
              <Text textAlign="right" variant="h5">
                {fines.reduce(
                  (acc, fine) => acc + (fine.amountSelected > 0 ? 1 : 0),
                  0,
                )}
                {formatMessage(m.fines.countPostfix)}
              </Text>
            </Stack>
          </Box>
        </Box>
      </Stack>
      <TableOfContents
        headings={[
          { headingId: 'fine', headingTitle: 'Sektir' },
          { headingId: 'speed-measurement', headingTitle: ' Hraðamæling' },
        ]}
        onClick={(headingId) => {
          setSelectedHeadingId(headingId as 'fine' | 'speed-measurement')
        }}
        tableOfContentsTitle="Yfirlit"
        selectedHeadingId={selectedHeadingId}
      />
      {selectedHeadingId === 'fine' && (
        <FineCalculator fines={fines} setFines={setFines} />
      )}
      {selectedHeadingId === 'speed-measurement' && (
        <SpeedMeasurementCalculator
          measuredSpeed={measuredSpeed}
          speedLimit={speedLimit}
          over3500kgOrWithTrailer={over3500kgOrWithTrailer}
          setMeasuredSpeed={setMeasuredSpeed}
          setSpeedLimit={setSpeedLimit}
          setOver3500kgOrWithTrailer={setOver3500kgOrWithTrailer}
          speedLimitOptions={speedLimitOptions}
        />
      )}
    </Stack>
  )
}
