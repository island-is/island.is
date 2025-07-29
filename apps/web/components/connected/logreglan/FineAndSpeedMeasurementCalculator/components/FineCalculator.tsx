import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/web/utils/currency'

import { m } from '../translation.strings'
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
  fines: FineState[]
  setFines: Dispatch<SetStateAction<FineState[]>>
}

interface FineCardListProps {
  fines: FineState[]
  searchValue: string
  setFines: Dispatch<SetStateAction<FineState[]>>
  setSearchValue: Dispatch<SetStateAction<string>>
}

const FineCardList = ({
  fines,
  searchValue,
  setFines,
  setSearchValue,
}: FineCardListProps) => {
  const { formatMessage } = useIntl()

  return (
    <Stack space={8}>
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
                            flexWrap="nowrap"
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

export const FineCalculator = ({ fines, setFines }: FineCalculatorProps) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <FineCardList
      fines={fines}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      setFines={setFines}
    />
  )
}
