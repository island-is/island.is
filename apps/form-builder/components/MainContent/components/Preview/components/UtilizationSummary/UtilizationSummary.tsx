import {
  Select,
  GridColumn,
  GridRow,
  Button,
  Stack,
  Box,
  Icon,
  RadioButton,
  Text,
} from "@island.is/island-ui/core"
import { useState } from "react"


export default function UtilizationSummary() {

  const years = [
    {
      label: '2021',
      value: '2021'
    },
    {
      label: '2022',
      value: '2022'
    },
    {
      label: '2023',
      value: '2023'
    },
    {
      label: '2024',
      value: '2024'
    },
  ]

  const [chosenYear, setChosenYear] = useState(null)
  const [chosenMonth, setChosenMonth] = useState(0)
  const [hasIncomeToReport, setHasIncomeToReport] = useState(false)

  return (
    <Stack space={2}>
      <GridRow>
        <GridColumn span='5/12'>
          <Select
            options={years}
            name='year'
            label='Ár'
            placeholder="Veldu ár"
            onChange={(date) => setChosenYear(date.value)}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn>
          <Text variant="h5">Var eignin eitthvað í útleigu á almanaksárinu sem er valið?</Text>
        </GridColumn>
      </GridRow>
      {chosenYear && (
        <GridRow>
          <GridColumn span="5/10">
            <RadioButton
              label="Já"
              checked={hasIncomeToReport}
              name="yes"
              onChange={() => setHasIncomeToReport(true)}
              large
              backgroundColor="white"
            />
          </GridColumn>
          <GridColumn span="5/10">
            <RadioButton
              label="Nei"
              checked={!hasIncomeToReport}
              name="no"
              onChange={() => setHasIncomeToReport(false)}
              large
              backgroundColor="white"
            />
          </GridColumn>
        </GridRow>
      )}
      {hasIncomeToReport && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            style={{ width: '90%' }}>
            <GridRow>
              <GridColumn span={'1/7'}>
                <Icon icon="arrowBack" />
              </GridColumn>
              <GridColumn span="5/7">

              </GridColumn>
              <GridColumn span={'1/7'}>
                <Icon icon="arrowForward" />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={'1/7'}>
                <Text>Mán</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Þri</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Mið</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Fim</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Fös</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Lau</Text>
              </GridColumn>
              <GridColumn span={'1/7'}>
                <Text>Sun</Text>
              </GridColumn>
            </GridRow>
            {createMonth(getAllDateStringsInMonth(chosenMonth, chosenYear))}
          </Box>
        </Box>

      )}
    </Stack>
  )
}

function createMonth(dates: Date[]) {
  // create a month component containing GridRows and GridColumns for each day in the month
  // It should make sure that the first day of the month is in the correct column
  // It should make sure that the last day of the month is in the correct column
  // It should make sure that the first day of the month is in the correct row
  // It should make sure that the last day of the month is in the correct row
  // It should make sure that the first day of the month is in the correct column and row
  const firstDay = dates[0];
  const lastDay = dates[dates.length - 1];
  return (
    dates.map((date, index) => (
      <GridRow key={index}>
        <GridColumn>
          {date.getDate()}
        </GridColumn>
      </GridRow>
    ))
  );
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

function getAllDateStringsInMonth(month: number, year: number): Date[] {
  const days = getDaysInMonth(month, year)
  const dateStrings = []
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  for (let i = 1; i <= days; i++) {
    const date = new Date(Date.UTC(year, month - 1, i))
    dateStrings.push(date);
  }
  return dateStrings
}
