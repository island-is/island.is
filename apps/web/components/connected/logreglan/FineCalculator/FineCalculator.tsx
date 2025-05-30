import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  Input,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'
import { formatCurrency } from '@island.is/web/utils/currency'

import { m } from './translation.strings'
import * as styles from './FineCalculator.css'

const QUARTER_OFF_FINE_MULTIPLIER = 0.75

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
}

interface FineState extends Fine {
  amountSelected: number
  id: number
}

interface FineCalculatorProps {
  slice: ConnectedComponent
}

interface FineCalculatorDetailsProps {
  fines: FineState[]
  goBack: () => void
  slice: ConnectedComponent
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
}: FineCalculatorDetailsProps) => {
  const { formatMessage } = useIntl()

  const selectedFines = fines.filter((fine) => fine.amountSelected > 0)

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
                {fine.law} {fine.title} x {fine.amountSelected}
              </Table.Data>
              <Table.Data align="right">
                {formatCurrency(fine.price)}
              </Table.Data>
              <Table.Data align="right">
                {formatCurrency(fine.price * QUARTER_OFF_FINE_MULTIPLIER)}
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

interface FineCardListProps {
  fines: FineState[]
  searchValue: string
  calculate: () => void
  setFines: Dispatch<SetStateAction<FineState[]>>
  setSearchValue: Dispatch<SetStateAction<string>>
}

const FineCardList = ({
  fines,
  searchValue,
  calculate,
  setFines,
  setSearchValue,
}: FineCardListProps) => {
  const { formatMessage } = useIntl()
  const price = fines.reduce(
    (acc, fine) => acc + fine.price * fine.amountSelected,
    0,
  )
  const points = calculateTotalPoints(fines)

  return (
    <Stack space={8}>
      <Stack space={3}>
        <Box display="flex" justifyContent="flexEnd">
          <Button
            icon="arrowForward"
            variant="text"
            size="small"
            onClick={calculate}
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
      <Stack space={5}>
        <Input
          name="fine-calculator-input"
          placeholder={formatMessage(m.fines.inputPlaceholder)}
          size="sm"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
        />
        <GridContainer>
          <GridRow rowGap={2}>
            {fines
              .filter(
                (fine) =>
                  fine.title
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  fine.subtitle
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
              )
              .map((fine) => {
                const onClick = () => {
                  setFines((prev) =>
                    prev.map((f) => {
                      if (f.id !== fine.id) return f
                      return {
                        ...f,
                        amountSelected:
                          (f.amountSelected + 1) %
                          ((f.maxAmountThatCanBeSelected ?? 1) + 1),
                      }
                    }),
                  )
                }
                return (
                  <GridColumn
                    key={fine.id}
                    span={['1/1', '1/2', '1/1', '1/2', '1/3']}
                  >
                    <FocusableBox
                      padding={[2, 2, 3]}
                      border="standard"
                      borderRadius="large"
                      borderWidth="large"
                      borderColor={
                        fine.amountSelected > 0 ? 'blue400' : 'blue200'
                      }
                      height="full"
                      width="full"
                      tabIndex={0}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault()
                          onClick()
                        }
                      }}
                      onClick={(ev) => {
                        onClick()
                        ev.currentTarget.blur()
                      }}
                      display="flex"
                      flexDirection="column"
                      userSelect="none"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        rowGap={1}
                        justifyContent="spaceBetween"
                        height="full"
                      >
                        <Box display="flex" flexDirection="column" rowGap={1}>
                          <Inline
                            justifyContent="spaceBetween"
                            alignY="center"
                            space={1}
                          >
                            <Text variant="small">{fine.law}</Text>
                            <Box
                              style={{
                                visibility:
                                  fine.amountSelected > 0
                                    ? 'visible'
                                    : 'hidden',
                              }}
                            >
                              <Inline alignY="center" space={0}>
                                <Box
                                  style={{
                                    visibility:
                                      typeof fine.maxAmountThatCanBeSelected ===
                                        'number' && fine.amountSelected > 0
                                        ? 'visible'
                                        : 'hidden',
                                  }}
                                >
                                  <Text lineHeight="md" variant="small">
                                    {fine.amountSelected}/
                                    {fine.maxAmountThatCanBeSelected ?? 1}
                                  </Text>
                                </Box>
                                <Icon
                                  icon="checkmark"
                                  size="medium"
                                  color="blue400"
                                />
                              </Inline>
                            </Box>
                          </Inline>
                          <Text variant="h4">{fine.title}</Text>
                          <Text variant="small">{fine.subtitle}</Text>
                        </Box>
                        <Box display="flex" flexDirection="column" rowGap={1}>
                          <Text variant="h5" color="blue600">
                            {formatCurrency(fine.price)}
                          </Text>
                          <Text variant="small">
                            {formatMessage(m.fines.pointsPrefix)}
                            {fine.points}
                          </Text>
                        </Box>
                      </Box>
                    </FocusableBox>
                  </GridColumn>
                )
              })}
          </GridRow>
        </GridContainer>
      </Stack>
    </Stack>
  )
}

export const FineCalculator = ({ slice }: FineCalculatorProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [fines, setFines] = useState<FineState[]>(
    slice.json?.fines?.map((fine: Fine, index: number) => ({
      ...fine,
      amountSelected: 0,
      id: index,
    })) ?? [],
  )

  return showDetails ? (
    <FineCalculatorDetails
      fines={fines}
      goBack={() => setShowDetails(false)}
      slice={slice}
    />
  ) : (
    <FineCardList
      fines={fines}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      setFines={setFines}
      calculate={() => setShowDetails(true)}
    />
  )
}
